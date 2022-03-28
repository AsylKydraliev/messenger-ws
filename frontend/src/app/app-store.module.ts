import { NgModule } from '@angular/core';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { usersReducer } from './store/users/users.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './store/users/users.effects';

export const localStorageSyncReducer = (reducer: ActionReducer<any>) => {
  return localStorageSync({
    keys: [{users: ['user']}],
    rehydrate: true
  })(reducer);
}

const metaReducers: Array<MetaReducer> = [localStorageSyncReducer];

const reducers = {
    users: usersReducer,
  };

const effects = [UsersEffects];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers,{metaReducers}),
    EffectsModule.forRoot(effects),
  ],
  exports: [StoreModule, EffectsModule]
})

export class AppStoreModule {}
