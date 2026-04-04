import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginCallbackComponent } from './features/auth/pages/LoginCallbackComponent';
import { RegisterComponent } from './features/register/register.component';

export const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'callback', component: LoginCallbackComponent},
  {path:'register', component:RegisterComponent}
];
