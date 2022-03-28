import { createAction, props } from '@ngrx/store';
import { LoginError, LoginUserData, RegisterError, RegisterUser, User } from '../../models/user.model';

export const registerUserRequest = createAction('[Users] Register Request', props<{users: RegisterUser}>());
export const registerUserSuccess = createAction('[Users] Register Success', props<{user: User}>());
export const registerUserFailure = createAction('[Users] Register Failure', props<{error: null | RegisterError}>());

export const loginUsersRequest = createAction('[Users] Login Request', props<{userData: LoginUserData}>());
export const loginUsersSuccess = createAction('[Users] Login Success', props<{user: User}>());
export const loginUsersFailure = createAction('[Users] Login Failure', props<{error: null | LoginError}>());

export const logoutUser = createAction('[Users] Logout');
export const logoutUserRequest = createAction('[Users] Logout Server Request');

