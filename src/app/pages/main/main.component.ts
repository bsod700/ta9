import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableService } from '../..//shared/services/table.service';
import { Item } from '../../shared/interfaces/item.interface';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { NewItemComponent } from '../../shared/components/new-item/new-item.component';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../../shared/store/user/selectors/user.selectors';
import { LoginComponent } from '../../shared/components/login/login.component';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import * as UserActions from '../../shared/store/user/actions/user.actions';
import {MatButtonModule} from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { AppState } from '../../shared/store/core/app.state';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, SearchBarComponent, TableComponent , NewItemComponent, 
    LoginComponent, CommonModule, MatIconModule, MatButtonModule, MatSidenavModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatDrawer;
  
  private destroy$ = new Subject<void>();
  private store: Store<AppState> = inject(Store<AppState>)
  private userService: UserService = inject(UserService)
  username$!: Observable<string | null>;

  filter = '';
  tableService: TableService = inject(TableService)

  table: {
    titles: string[],
    content: Item[]
  } = {
    titles: [],
    content: []
  }
  username!: string | null;

  selectedRow!: number | null

  onExitClick: boolean = false
  view: string = 'rows'

  ngOnInit(): void {
    const items = this.tableService.loadItemHttp()
    this.tableService.saveItemsHttp(items)

    this.store.subscribe(state => console.log(state));
    this.username$ = this.store.select(UserSelectors.selectUsername);

    this.getTableContent()

    this.username$.subscribe(username => {
      console.log('Username from store:', username);
    });

    
    
  }

  applyFilter(filterValue: string) {
    this.filter = filterValue;
  }
  logout():void {
    this.store.dispatch(UserActions.logout());
  }

  getTableContent(): void {
    this.tableService.getItems().pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: Item[]) => {
      console.log('Data received:', data); 
      this.table.content = data;
      this.getTableTitles()
    });
  }
  
  getTableTitles(): void {
    this.tableService.getTitles().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.table.titles = data;
    });
  }

  onRowClicked(id: number) {
    this.selectedRow = id;
    console.log('id: ', id);
    this.drawer.open()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onItemSave(data: Item | null) {
    console.log('from main: ', data);
    
  }
  exitClick(isClick: boolean) {
    isClick ? this.drawer.close() : ''
  }
  onClickOnAdd() {
    this.drawer.open()
    this.selectedRow = null
  }
  changeView(view: string) {
    this.view = view
  }
}
