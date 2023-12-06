import { createSelector } from '@ngrx/store';
import { Item } from '../../../interfaces/item.interface';
import { AppState } from '../../core/app.state';
import { ItemState } from '../item.state';

export const selectItemState = (state: AppState) => state.items;

export const selectAllItems = createSelector(
  selectItemState,
  (state: ItemState) => state.items
);

export const selectItemsError = createSelector(
  selectItemState,
  (state: ItemState) => state.error
);

export const selectItemTitles = createSelector(
  selectAllItems,
  (items: Item[]) => items.length > 0 ? Object.keys(items[0]) : []
);

export const selectItemsLength = createSelector(
  selectAllItems,
  (items: Item[]) => items.length
);
