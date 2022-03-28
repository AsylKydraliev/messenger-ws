import { createAction, props } from '@ngrx/store';
import { Message } from '../../models/message.model';

export const fetchMessagesRequest = createAction('[Messages] Fetch Request');
export const fetchMessagesSuccess = createAction('[Messages] Fetch Success', props<{messages: Message[]}>());


