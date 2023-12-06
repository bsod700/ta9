import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../interfaces/item.interface';

import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableComponent implements AfterViewInit, OnInit, OnChanges  {
  @Input() content!: {
    titles: string[],
    content: Item[]
  }
  @Input() filter = ""
  @Output() rowClicked = new EventEmitter<number>();
  @Input() view: string = 'rows'

  dataSource: any
  selectedRow: any;
  items: Item[] = []
  constructor(private _liveAnnouncer: LiveAnnouncer) {
   
  }
  ngOnInit(): void {
    this.content = {
      titles: this.content.titles,
      content: this.content.content
    }
    
    this.searchNames()
    this.updatePaginatorProperties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.content) {
      this.searchNames()
      this.updatePaginatorProperties();
    }
   
  }
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(row: Item) {
    this.rowClicked.emit(row.id);
    this.selectedRow = row;
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  pageEvent!: PageEvent;
  length = 0; // Total number of items in the dataset
  pageSize = 10; // Default number of items per page

  handlePageEvent(e: PageEvent) {
    const pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    const previousSize = this.pageSize * pageIndex;
  }

  updatePaginatorProperties() {
    this.length = this.content.content.length;
  }

  searchNames() {
    const applyFilter = this.content.content.filter(item =>
      item.name.toLowerCase().includes(this.filter.toLowerCase())
    );
    this.setDataSource(applyFilter)
    this.items = applyFilter
  }
  setDataSource(content: Item[]): void {
    this.dataSource = new MatTableDataSource<Item>(content);
  }

  isColorString(value: string): boolean {
    return /^#([0-9a-f]{3}){1,2}$/i.test(value);
  }
}
