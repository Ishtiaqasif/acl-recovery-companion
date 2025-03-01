import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - ACL Recovery Companion'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Create Account - ACL Recovery Companion'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];