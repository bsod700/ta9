import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user/actions/user.actions';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as UserSelectors from '../../shared/store/user/selectors/user.selectors';
import { AppState } from '../store/core/app.state';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private store: Store<AppState> = inject(Store<AppState>)
  private usernameSubject = new BehaviorSubject<string | null>(null);
  
  saveUsername(username: string): void {
    this.store.dispatch(UserActions.saveUsername({ username }));
  }
  getCurrentUser(): string | null {
    this.store.select(UserSelectors.selectUsername).subscribe(username => this.usernameSubject.next(username));
    return this.usernameSubject.getValue();
  }
}
