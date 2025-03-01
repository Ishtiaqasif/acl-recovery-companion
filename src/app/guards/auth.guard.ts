import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Check if user is logged in
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Not logged in - redirect to login page with return URL
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    // Not logged in - redirect to login page with return URL
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  // Check if user is an admin
  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (user && user.role === 'admin') {
        return true;
      }
      
      // User is not an admin - redirect to home page
      router.navigate(['/']);
      return false;
    })
  );
};