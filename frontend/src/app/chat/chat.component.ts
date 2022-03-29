import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/types';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { NgForm } from '@angular/forms';
import { fetchMessagesRequest } from '../store/users/messages.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  user: Observable<null | User>;
  stateMessages: Observable<Message[]>;
  ws!: WebSocket;
  userName = '';
  token = '';
  messages!: Message[];
  userData: User | null = null;
  messageSub!: Subscription;
  userSub!: Subscription;

  constructor(private store: Store<AppState>) {
    this.user = store.select(state => state.users.user);
    this.stateMessages = store.select(state => state.messages.messages);

    this.messageSub = this.stateMessages.subscribe(message => {
      this.messages = message.slice().reverse();
    })

    this.userSub = this.user.subscribe(user => {
      this.userData = user;
    })
  }

  ngOnInit(): void {
    this.store.dispatch(fetchMessagesRequest());
    this.ws = new WebSocket('ws://localhost:8000/chat');

    this.ws.onclose = () => {
      setTimeout(() => {
        this.ws = new WebSocket('ws://localhost:8000/chat');
      }, 1000)
    }

    this.ws.onmessage = event => {
      const decodedMessage = JSON.parse(event.data);

      if(decodedMessage.type === "NEW_MESSAGE"){
        this.messages = decodedMessage.message;
        this.messages.reverse();
      }
    }

    this.ws.onopen = () => {
      this.setUser();
    }
  }

  setUser(){
    this.userName = <string>this.userData?.displayName;
    this.token = <string>this.userData?.token;

    this.ws.send(JSON.stringify({
      type: 'LOGIN',
      user: <string>this.userData?._id,
      token: this.token
    }))
  }

  sendMessage(){
    this.ws.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      message: {
        message: this.form.value.text,
        username: this.userData,
      },
    }));

    this.form.reset();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.messageSub.unsubscribe();
    this.ws.close();
  }
}
