import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../interfaces/item.interface';

import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { DataTable } from '../../interfaces/data-table.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableComponent implements AfterViewInit  {
  /**
   * Sets the content for the table and applies the filter.
   * @param content The data to be displayed in the table.
   */
  @Input('content') set _content(content: DataTable) {
    this.setDataSource(content.content);
    this.content = content;
    this.paginatedData = content.content;
    this.applyFilter();
  }
  @Input() filter = "";
  @Output() rowClicked = new EventEmitter<number>();
  @Input() view: string = 'rows';

  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>();
  selectedRow: Item | null = null;

  pageEvent!: PageEvent;
  length = 0; // Total number of items in the dataset
  pageSize = 10; // Default number of items per page

  content!: DataTable;

  paginatedData: Item[] = [];

  private _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
 * Initializes sort and paginator after view init.
 */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginateData();
  }

  /**
 * Emits the clicked row's ID and marks it as selected.
 * @param row The item corresponding to the clicked row.
 */
  onRowClick(row: Item): void {
    this.rowClicked.emit(row.id);
    this.selectedRow = row;
  }

  /**
 * Announces the current sort state for accessibility.
 * @param sortState The current state of sorting.
 */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
 * Handles page change events for pagination.
 * @param event The pagination event data.
 */
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = event.pageIndex;
    }

    this.paginator.pageIndex = event.pageIndex;
    this.paginateData();
  }

  /**
 * Sets the data source for the table.
 * @param data Array of items to be displayed.
 */
  setDataSource(data: Item[]) {
    this.dataSource.data = [...data];
    this.length = data.length;
  }

  /**
 * Applies a filter to the table data.
 */
  applyFilter() {
    const filterValue = this.filter.toLowerCase().trim();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
 * Checks if a given value is a valid hex color string.
 * @param value The value to check.
 * @returns True if the value is a valid hex color.
 */
  isColorString(value: string): boolean {
    return /^#([0-9a-f]{3}){1,2}$/i.test(value);
  }
  
  /**
 * Paginates the data based on the current page index and size.
 */
  paginateData() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    this.paginatedData = this.dataSource.filteredData.slice(startIndex, startIndex + this.paginator.pageSize);
  }
}
