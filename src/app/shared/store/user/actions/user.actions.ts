import { createAction, props } from '@ngrx/store';

export const saveUsername = createAction(
  '[User Input] Save Username',
  props<{ username: string }>()
);
export const logout = createAction('[User] Logout');