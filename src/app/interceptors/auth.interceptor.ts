import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Since we're using MongoDB Realm directly, we don't need to
  // intercept and add auth tokens to HTTP requests
  
  // Only intercept API requests if needed
  if (request.url.startsWith(environment.apiUrl)) {
    // For example, you might need to add specific headers for third-party APIs
    const modifiedReq = request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
    return next(modifiedReq);
  }
  
  // Process other requests without changes
  return next(request);
};