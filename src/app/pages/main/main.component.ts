import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableService } from '../..//shared/services/table.service';
import { Item } from '../../shared/interfaces/item.interface';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
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
import { DataTable } from '../../shared/interfaces/data-table.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HttpClientModule, SearchBarComponent, TableComponent , NewItemComponent, 
    LoginComponent, CommonModule, MatIconModule, MatButtonModule, MatSidenavModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  private store: Store<AppState> = inject(Store<AppState>)
  private userService: UserService = inject(UserService)
  username$!: Observable<string | null>;

  filter = '';
  tableService: TableService = inject(TableService)

  table: DataTable = {
    titles: [],
    content: []
  }
  username!: string | null;

  selectedRow!: number | null

  onExitClick: boolean = false
  view: string = 'rows'

  title: string = ''

  ngOnInit(): void {
    const items = this.tableService.loadItemHttp()
    this.tableService.saveItemsHttp(items)

    this.username$ = this.store.select(UserSelectors.selectUsername);

    this.getTableContent()

    this.username$.subscribe(username => {
      console.log('Username from store:', username);
    });

    this.title = 'Management Tool'
  }

  applyFilter(filterValue: string) {
    this.filter = filterValue;
  }

  logout():void {
    this.store.dispatch(UserActions.logout());
  }

  getTableContent(): void {
    this.tableService.getItems().subscribe((data: Item[]) => {
      this.table.content = data;
      this.getTableTitles()
    });
  }
  
  getTableTitles(): void {
    this.tableService.getTitles().subscribe((titles: string[]) => {
      this.table.titles = titles;
    });
  }

  onRowClicked(id: number) {
    this.selectedRow = id;
    this.drawer.open()
  }

  onItemSave() {
    this.table = {titles: this.table.titles, content: this.table.content};
    this.selectedRow = null
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
