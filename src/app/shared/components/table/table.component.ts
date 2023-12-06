import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
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

  dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>();
  selectedRow: Item | null = null;

  pageEvent!: PageEvent;
  length = 0; // Total number of items in the dataset
  pageSize = 10; // Default number of items per page

  private _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef)

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.setDataSource(this.content.content);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      console.log("changes['content'] ", changes['content'].currentValue.content);
      
      this.setDataSource(changes['content'].currentValue.content);
    }
    if (changes['filter']) {
      this.applyFilter();
    }
  }

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

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = event.pageIndex;
    }
  }

  setDataSource(data: Item[]) {
    console.log('setDataSource');
    
    this.dataSource.data = data;
    this.length = data.length;
    this.cdr.markForCheck();
  }

  applyFilter() {
    const filterValue = this.filter.toLowerCase().trim();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isColorString(value: string): boolean {
    return /^#([0-9a-f]{3}){1,2}$/i.test(value);
  }
  
}
