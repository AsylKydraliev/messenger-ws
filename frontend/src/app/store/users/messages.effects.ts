import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs';
import { fetchMessagesRequest, fetchMessagesSuccess } from './messages.actions';
import { MessagesService } from '../../services/messages.service';

@Injectable()
export class MessagesEffects {
  fetchMessages = createEffect(() => this.actions.pipe(
    ofType(fetchMessagesRequest),
    mergeMap(() => this.messagesService.getMessages().pipe(
      map(messages => fetchMessagesSuccess({messages})),
    ))
  ))

  constructor(
    private actions: Actions,
    private messagesService: MessagesService,
  ) {}
}
