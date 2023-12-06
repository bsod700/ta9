import { createSelector } from '@ngrx/store';
import { AppState } from '../../core/app.state';
import { UserState } from '../user.state';

export const selectUser = (state: AppState) => state.user;

export const selectUsername = createSelector(
  selectUser,
  (state: UserState) => state.username
);
