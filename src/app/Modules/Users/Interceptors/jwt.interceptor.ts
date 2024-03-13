import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(observer => {
      // Subscribe to the isLoggedIn$ observable to get the latest login state
      this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          // If the user is logged in, get the token from the auth service
          const token = this.authService.getToken();

          if (token) {
            // If a token is found, clone the request and add the token to the headers
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          } else {
            // If no token is found, do nothing and send the original request
          }
        } else {
          // If the user is not logged in, send the original request without modifying it
        }

        // Handle the request and pass the events to the outer observable
        const subscription = next.handle(request).subscribe(
          event => observer.next(event),
          error => observer.error(error),
          () => observer.complete()
        );

        // Return a teardown function to unsubscribe from the inner subscription
        return () => {
          subscription.unsubscribe();
        };
      });
    });
  }
}