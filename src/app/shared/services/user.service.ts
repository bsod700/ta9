import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user/actions/user.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import * as UserSelectors from '../../shared/store/user/selectors/user.selectors';
import { AppState } from '../store/core/app.state';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Injects the NgRx Store to manage application state.
  private store: Store<AppState> = inject(Store<AppState>);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  
  /**
   * Dispatches an action to save the username in the store.
   * @param username The username to be saved.
 */
  saveUsername(username: string): void {
    this.store.dispatch(UserActions.saveUsername({ username }));
  }

  /**
   * Retrieves the current user's username from the store.
   * Returns the latest value of the username.
 */
  getCurrentUser(): string | null {
    this.store.select(UserSelectors.selectUsername).subscribe(username => this.usernameSubject.next(username));
    return this.usernameSubject.getValue();
  }

  /**
   * Returns an Observable of the current username.
 */
  getUser(): Observable<string | null> {
    return this.store.select(UserSelectors.selectUsername);
  }

  /**
  * Dispatches a logout action to reset user-related state.
 */
  logout(): void {
    this.store.dispatch(UserActions.logout());
  }
}
