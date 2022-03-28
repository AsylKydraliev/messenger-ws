import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/types';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Message, MessageClass, ServerMessage } from '../models/message.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  user: Observable<null | User>;
  ws!: WebSocket;
  userName = '';
  token = '';
  messages: MessageClass[] = [];
  userData: User | null = null;
  decodedMessage!: ServerMessage;

  constructor(private store: Store<AppState>) {
    this.user = store.select(state => state.users.user);
    this.user.subscribe(user => {
      this.userData = user;
    })
  }

  ngOnInit(): void {
    this.ws = new WebSocket('ws://localhost:8000/chat');

    this.ws.onclose = () => {
      setTimeout(() => {
        this.ws = new WebSocket('ws://localhost:8000/chat');
      }, 1000)
    }

    this.ws.onmessage = event => {
      this.decodedMessage = JSON.parse(event.data);

      if(this.decodedMessage.type === 'NEW_MESSAGE'){
        this.messages = <any>this.decodedMessage.message;
      }
    }

    this.ws.onopen = () => {
      this.setUser();
      this.getMessages();
    }
  }

  getMessages(){
    this.ws.send(JSON.stringify({
      type: 'GET_MESSAGES',
      messages: [],
    }))
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
    this.ws.close();
  }
}
