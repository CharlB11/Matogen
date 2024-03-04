import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'C:/xampp/htdocs/warehouse/src/app/auth.service'

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
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
  }
}