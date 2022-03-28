import { MessageState } from '../types';
import { createReducer, on } from '@ngrx/store';
import { fetchMessagesRequest, fetchMessagesSuccess } from './messages.actions';

const initialState: MessageState = {
  messages: [],
  fetchLoading: false
}

export const messagesReducer = createReducer(
  initialState,
  on(fetchMessagesRequest, state => ({...state, fetchLoading: true})),
  on(fetchMessagesSuccess, (state, {messages}) => ({...state, fetchLoading: false, messages})),
)
