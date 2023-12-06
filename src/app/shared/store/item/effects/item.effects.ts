import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as ItemActions from '../actions/item.actions';
import { Item } from '../../../interfaces/item.interface';

@Injectable()
export class ItemEffects {
  private actions$: Actions = inject(Actions)
  private http: HttpClient = inject(HttpClient)
  
  loadItems$ = createEffect(() => this.actions$.pipe(
    ofType(ItemActions.loadItems),
    mergeMap(() => this.http.get<{ items: Item[] }>('assets/json/items.json').pipe(
      map(response => ItemActions.loadItemsSuccess({ items: response.items })),
      tap(value => console.log('after response operation:', value)),
      catchError(error => of(ItemActions.loadItemsFailure({ error })))
    ))
  ))
}
