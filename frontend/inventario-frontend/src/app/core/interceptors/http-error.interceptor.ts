import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          alert('Sesión expirada o no autenticado.');
        } else if (err.status === 403) {
          alert('No autorizado para esta acción.');
        } else if (err.status === 422) {
          const msg = (err.error && err.error.message) ? err.error.message : 'Errores de validación';
          alert(msg);
        } else if (err.status >= 500) {
          alert('Error del servidor. Inténtalo más tarde.');
        }
        return throwError(() => err);
      })
    );
  }
}
