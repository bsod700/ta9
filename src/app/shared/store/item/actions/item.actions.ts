import { createAction, props } from '@ngrx/store';
import { Item } from '../../../interfaces/item.interface';

export const loadItems = createAction('[Item] Load Items');
export const loadItemsSuccess = createAction('[Item] Load Items Success', props<{ items: Item[] }>());
export const loadItemsFailure = createAction('[Item] Load Items Failure', props<{error: any}>())
export const addItem = createAction('[Item] Add Item', props<{ item: Item }>());
export const updateItem = createAction('[Item] Update Item', props<{ item: Item, id: number }>());
export const addItemFailure = createAction('[Item] Add Item Failure', props<{error: any}>())
export const saveItems = createAction('[Item] Save Items', props<{ items: Item[] }>())
