import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jsonReq: HttpRequest<any> = req.clone({
      setHeaders: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'Pragma': 'no-cache'}
    });
    return next.handle(jsonReq);
  }
}
