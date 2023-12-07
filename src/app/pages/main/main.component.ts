import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableService } from '../..//shared/services/table.service';
import { Item } from '../../shared/interfaces/item.interface';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewItemComponent } from '../../shared/components/new-item/new-item.component';
import { LoginComponent } from '../../shared/components/login/login.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
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
  // Reference to the MatDrawer component.
  @ViewChild('drawer') drawer!: MatDrawer;

  // Injects UserService and TableService for user and table data management.
  private userService: UserService = inject(UserService);
  private tableService: TableService = inject(TableService);

  // Observable for the current user's username.
  username$!: Observable<string | null>;

  // Holds the current filter value.
  filter = '';

  // Data structure for the table, including titles and content.
  table: DataTable = {
    titles: [],
    content: []
  };

  // The ID of the selected row in the table.
  selectedRow!: number | null;

  // Flag to indicate if the exit button was clicked.
  onExitClick: boolean = false;

  // Current view mode for the table (rows or boxes).
  view: 'rows' | 'boxes' = 'rows';

  // Title of the component
  title: string = '';

  /**
 * Initializes component state, loads table data, and sets the title.
 */
  ngOnInit(): void {
    const items = this.tableService.loadItemHttp();
    this.tableService.saveItemsHttp(items);

    this.username$ = this.userService.getUser();

    this.getTableContent();

    this.title = 'Management Tool';
  }

  /**
 * Applies the specified filter value to the table.
 * @param filterValue The value to be applied as a filter.
 */
  applyFilter(filterValue: string) {
    this.filter = filterValue;
  }

  /**
 * Logs out the current user.
 */
  logout():void {
    this.userService.logout();
  }

  /**
 * Fetches and updates the table content.
 */
  getTableContent(): void {
    this.tableService.getItems().subscribe((data: Item[]) => {
      this.table.content = data;
      this.getTableTitles();
    });
  }

  /**
 * Retrieves and sets the table titles.
 */
  getTableTitles(): void {
    this.tableService.getTitles().subscribe((titles: string[]) => {
      this.table.titles = titles;
    });
  }

  /**
 * Handles row click events in the table, setting the selected row and opening the drawer.
 * @param id The ID of the clicked row.
 */
  onRowClicked(id: number) {
    this.selectedRow = id;
    this.drawer.open();
  }

  /**
 * Updates the table data and resets the selected row.
 */
  onItemSave() {
    this.table = {titles: this.table.titles, content: this.table.content};
    this.selectedRow = null;
  }

  /**
 * Handles the exit click event, closing the drawer if needed.
 * @param isClick Boolean indicating if the exit was clicked.
 */
  exitClick(isClick: boolean) {
    isClick ? this.drawer.close() : '';
  }

  /**
 * Opens the drawer and resets the selected row, preparing for adding a new item.
 */
  onClickOnAdd() {
    this.drawer.open();
    this.selectedRow = null;
  }
  
  /**
 * Changes the current view of the table (rows or boxes).
 * @param view The view mode to be set.
 */
  changeView(view: 'rows' | 'boxes') {
    this.view = view;
  }
}
