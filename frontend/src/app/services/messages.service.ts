import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message, MessageClass } from '../models/message.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) {}

  getMessages(){
    return this.http.get<Message[]>(environment.apiUrl + '/chat').pipe(
      map(response => {
        console.log(response)
        return response.map(messages =>{
           return new MessageClass(
             messages._id,
             messages.userId,
             messages.message,
             messages.username,
           )
          }
        )
      })
    )
  }
}
