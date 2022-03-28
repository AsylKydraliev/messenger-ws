import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/types';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  user: Observable<null | User>;

  constructor(private store: Store<AppState>) {
    this.user = store.select(state => state.users.user);
  }

  ngOnInit(): void {
  }

}
