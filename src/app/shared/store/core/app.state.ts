import { ActionReducerMap } from '@ngrx/store';
import { userReducer } from '../user/reducers/user.reducer';
import { itemReducer } from '../item/reducers/item.reducer';
import { UserState } from '../user/user.state';
import { ItemState } from '../item/item.state';


export interface AppState {
  user: UserState;
  items: ItemState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  items: itemReducer
};