import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { UserState } from '../user.state';

export const initialState: UserState = {
  username: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.saveUsername, (state, { username }) => ({ ...state, username })),
  on(UserActions.logout, state => ({ ...state, username: null }))
);
