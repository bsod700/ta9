import { createReducer, on } from '@ngrx/store';
import * as ItemActions from '../actions/item.actions';
import { ItemState } from '../item.state';

export const initialState: ItemState = {
  items: [],
  error: null
};

export const itemReducer = createReducer(
  initialState,
  on(ItemActions.loadItemsSuccess, (state, { items }) => ({ 
    ...state, 
    items 
  })),
  on(ItemActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    items: [],
    error: error
  })),
  on(ItemActions.addItem, (state, { item }) => ({ 
    ...state, 
    items: [...state.items, item] 
  })),
  on(ItemActions.updateItem, (state, { item }) => ({
    ...state,
    items: state.items.map(i => i.id === item.id ? item : i)
  })),
  on(ItemActions.saveItems, (state, { items }) => ({ 
    ...state, 
    items 
  })),
);
