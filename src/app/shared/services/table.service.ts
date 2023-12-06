import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, of, take, withLatestFrom } from 'rxjs';
import { Item } from '../interfaces/item.interface';
import * as ItemActions from '../store/item/actions/item.actions';
import * as fromItemSelectors from '../store/item/selectors/item.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../store/core/app.state';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private store: Store<AppState> = inject(Store<AppState>)
  private http: HttpClient = inject(HttpClient)
  
  loadItems(): void {
    this.store.dispatch(ItemActions.loadItems());
  }

  getTitles(): Observable<string[]> {
    return this.store.select(fromItemSelectors.selectItemTitles);
  }
  getItems(): Observable<Item[]> {
    return this.store.select(fromItemSelectors.selectAllItems);
  }
  getErrors(): Observable<string | null> {
    return this.store.select(fromItemSelectors.selectItemsError);
  }
  saveItem(item: Item): void {
    this.store.dispatch(ItemActions.addItem({ item }));
  }

  updateItemById(id: number, data: Item): void {
    this.store.dispatch(ItemActions.updateItem({ item: data, id: id }));
  }

  getItemsLength(): number {
    let itemsLength = 0;
    of(null).pipe(
      withLatestFrom(this.store.select(fromItemSelectors.selectItemsLength)),
      take(1)
    ).subscribe(([_, length]) => {
      itemsLength = length;
    });
  
    return itemsLength;
  }

  
  loadItemHttp(): Observable<Item[]> {
    return this.http.get<{ items: Item[] }>('assets/json/items.json').pipe(
      map(response => response.items)
    );
  }
  saveItemsHttp(items$: Observable<Item[]>) {
    items$.subscribe(items => {
      this.store.dispatch(ItemActions.saveItems({ items }));
    })
   
  }
    // getTitles(): Observable<string[]> {
  //   return this.items$.pipe(
  //     map(items => items.length > 0 ? Object.keys(items[0]) : [])
  //   );
  // }
  // updateItems(): void {
  //   this.loadItems().subscribe(items => {
  //     this.items$.next(items);
  //   });
  // }

  // getItems(): Observable<Item[]> {
  //   return this.items$.asObservable();
  // }

  // getItemsLength(): number {
  //   const currentItems = this.items$.getValue();
  //   return currentItems.length
  // }

  // saveItem(item: Item): Observable<Object> {
  //   return this.http.post('http://localhost:4200/save-data', item);
  // }

  
  // updateItemById(id: number, data: Item): void {
  //   const currentItems = this.items$.getValue();
  //   const index = currentItems.findIndex((item: { id: number; }) => item.id === id);
  //   if (index !== -1) {
  //     currentItems[index] = data;
  //     this.items$.next(currentItems);
  //   } else {
  //     console.log(`Item with id ${id} not found`);
  //   }
  // }
}
