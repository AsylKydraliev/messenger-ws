import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  loginUsersFailure,
  loginUsersRequest,
  loginUsersSuccess,
  logoutUser,
  logoutUserRequest,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess
} from './users.actions';
import { map, mergeMap, tap } from 'rxjs';
import { HelpersService } from '../../services/helpers.service';

@Injectable()
export class UsersEffects {
  registerUser = createEffect(() => this.actions.pipe(
    ofType(registerUserRequest),
    mergeMap(({users}) => this.usersService.registerUser(users).pipe(
      map(user => registerUserSuccess({user})),
      tap(() => {
        this.helpers.openSnackbar('Register successful');
        void this.router.navigate(['/']);
      }),
      this.helpers.catchServerError(registerUserFailure)
    ))
  ))

  loginUser = createEffect(() => this.actions.pipe(
    ofType(loginUsersRequest),
    mergeMap(({userData}) => this.usersService.loginUser(userData).pipe(
      map(user => loginUsersSuccess({user})),
      tap(() => {
        this.helpers.openSnackbar('Login successful');
        void this.router.navigate(['/']);
      }),
      this.helpers.catchServerError(loginUsersFailure)
    ))
  ))

  logoutUser = createEffect(() => this.actions.pipe(
    ofType(logoutUserRequest),
    mergeMap(() => this.usersService.logoutUser().pipe(
      map(() => logoutUser()),
      tap(() => {
        this.helpers.openSnackbar('Logout successful');
        void this.router.navigate(['/']);
      })
    ))
  ))

  constructor(
    private actions: Actions,
    private usersService: UsersService,
    private router: Router,
    private helpers: HelpersService
  ) {}
}
