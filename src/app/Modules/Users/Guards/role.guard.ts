import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (): Observable<boolean> => {
    return this.authService.getUserRole().pipe(
      map(role => {
        if (role === 'admin') {
          return true;
        } else {
          this.router.navigate(['/login']); // Or any other fallback route
          return false;
        }
      })
    );
  };
}