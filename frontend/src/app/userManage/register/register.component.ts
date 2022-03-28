import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { RegisterError } from '../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { registerUserRequest } from '../../store/users/users.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('f') form!: NgForm;
  error: Observable<null | RegisterError>;
  errorSubscription!: Subscription;
  loading: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.error = store.select(state => state.users.registerError);
    this.loading = store.select(state => state.users.registerLoading);
  }

  ngAfterViewInit() {
    this.errorSubscription = this.error.subscribe(error => {
      if(error){
        const message = error.errors.email.message;
        this.form.form.get('email')?.setErrors({serverError: message});
      }else{
        this.form.form.get('email')?.setErrors({});
      }
    });
  }

  onSubmit() {
    this.store.dispatch(registerUserRequest({users: this.form.value}));
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }
}
