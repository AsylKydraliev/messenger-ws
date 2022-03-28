export interface User {
  _id: string,
  email: string,
  displayName: string,
  token: string,
}

export class UsersModel {
  constructor(
    public _id: string,
    public email: string,
    public displayName: string,
    public token: string,
  ) {}
}

export interface RegisterUser {
  email: string,
  displayName: string,
  password: string,
}

export interface LoginUserData {
  email: string,
  password: string
}

export interface FieldError {
  message: string
}

export interface  RegisterError {
  errors: {
    password: FieldError,
    email: FieldError,
    displayName: FieldError
  }
}

export interface LoginError {
  error: string
}
