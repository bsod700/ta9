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
  // Injects NgRx Store and HttpClient for state management and HTTP requests.
  private store: Store<AppState> = inject(Store<AppState>);
  private http: HttpClient = inject(HttpClient);
  
  /**
  * Dispatches an action to load table items from the store.
 */
  loadItems(): void {
    this.store.dispatch(ItemActions.loadItems());
  }

  /**
   * Selects and returns the table column titles from the store.
   * @returns Observable of table column titles.
 */
  getTitles(): Observable<string[]> {
    return this.store.select(fromItemSelectors.selectItemTitles);
  }

  /**
   * Retrieves a list of all table items from the store.
   * @returns Observable of table items.
 */
  getItems(): Observable<Item[]> {
    return this.store.select(fromItemSelectors.selectAllItems);
  }

  /**
   * Fetches any errors encountered during table operations from the store.
   * @returns Observable of error string, if any.
 */
  getErrors(): Observable<string | null> {
    return this.store.select(fromItemSelectors.selectItemsError);
  }

  /**
   * Saves a new item to the table by dispatching it to the store.
   * @param item The new item to be added.
 */
  saveItem(item: Item): void {
    this.store.dispatch(ItemActions.addItem({ item }));
  }

/**
   * Updates an existing table item in the store.
   * @param id The ID of the item to update.
   * @param data The new data for the item.
 */
  updateItemById(id: number, data: Item): void {
    this.store.dispatch(ItemActions.updateItem({ item: data, id: id }));
  }

  /**
   * @returns The total number of table items.
 */
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

  /**
   * Fetches table items from an external HTTP source.
   * @returns Observable of table items.
  */
    loadItemHttp(): Observable<Item[]> {
      return this.http.get<{ items: Item[] }>('assets/json/items.json').pipe(
        map(response => response.items)
      );
    }
    
    /**
     * Saves items to the store based on an external Observable source.
     * @param items$ Observable of items to be saved.
    */
    saveItemsHttp(items$: Observable<Item[]>) {
      items$.subscribe(items => {
        this.store.dispatch(ItemActions.saveItems({ items }));
      });
    }
}
