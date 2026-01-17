import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // The API key is already added in the service, but this interceptor
  // can be used for other purposes like adding headers, logging, etc.
  const modifiedReq = req.clone({
    setHeaders: {
      'Accept': 'application/json'
    }
  });
  return next(modifiedReq);
};


