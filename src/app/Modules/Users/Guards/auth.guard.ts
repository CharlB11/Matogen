import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = () => {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      // If not logged in, navigate to the login page
      this.router.navigate(['/login']);
      return false;
    }
    // If logged in, allow access to the route
    return true;
  };
}