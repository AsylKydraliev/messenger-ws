import { LoginError, RegisterError, User } from '../models/user.model';
import { Message } from '../models/message.model';

export type UserState = {
  user: null | User,
  registerLoading: boolean,
  registerError: null | RegisterError,
  loginLoading: boolean,
  loginError: null | LoginError,
  fetchLoading: boolean,
};

export type MessageState = {
  messages: Message[],
  fetchLoading: boolean,
};

export type AppState = {
  users: UserState,
  messages: MessageState,
};


