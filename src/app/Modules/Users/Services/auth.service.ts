import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { throwError } from 'rxjs';
import { IMyJwtPayload } from '../Interfaces/my-jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject to store and emit the user's login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // BehaviorSubject to store and emit the user's name
  private currentNameSubject = new BehaviorSubject<string>('');
  public currentName$ = this.currentNameSubject.asObservable();

  // BehaviorSubject to store and emit the user's role
  private currentRoleSubject = new BehaviorSubject<string>('');
  public currentRole$ = this.currentRoleSubject.asObservable();

  // BehaviorSubject to store and emit the user's email
  private currentEmailSubject = new BehaviorSubject<string>('');
  public currentEmail$ = this.currentEmailSubject.asObservable();

  // Key used to store the JWT token in local storage
  private jwtTokenKey = 'currentUserToken';

  constructor(private userService: UserService, private router: Router) {
    // Check and emit user details on service initialization
    this.checkAndEmitUserDetails();
  }

  // Check if a JWT token exists in local storage and emit user details
  private checkAndEmitUserDetails(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken) {
        this.currentNameSubject.next(decodedToken.data.name);
        this.currentEmailSubject.next(decodedToken.data.email);
        this.currentRoleSubject.next(decodedToken.data.role);
        this.isLoggedInSubject.next(true);
        this.startTokenExpirationTimer();
      }
    }
  }

  // Decode the JWT token and return the payload
  private decodeToken(token: string): IMyJwtPayload | null {
    try {
      return jwtDecode<IMyJwtPayload>(token);
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }

  // Start a timer to log out the user when the JWT token expires
  private startTokenExpirationTimer(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken) {
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        if (timeUntilExpiration > 0) {
          // Set a timer to log out the user when the token expires
          setTimeout(() => {
            this.logout();
          }, timeUntilExpiration);
        } else {
          // Token has already expired, log out the user immediately
          this.logout();
        }
      }
    }
  }

  // Login the user with email and password
  login(email: string, password: string): Observable<any> {
    return this.userService.loginUser({ email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.jwtTokenKey, response.token);
          console.log('Token set in local storage:', response.token);
          const decodedToken = this.decodeToken(response.token);
          if (decodedToken) {
            this.currentNameSubject.next(decodedToken.data.name);
            this.currentEmailSubject.next(decodedToken.data.email);
            this.currentRoleSubject.next(decodedToken.data.role);
            this.isLoggedInSubject.next(true);
            this.startTokenExpirationTimer();
          }
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

   // Logout the user
   logout(): void {
    const userId = this.getCurrentUserId();
    if (userId !== null) {
      this.userService.logoutUser(userId).subscribe({
        next: () => {
          console.log('Logout successful');
          // Clear the local storage and reset the subjects after successful logout
          localStorage.removeItem(this.jwtTokenKey);
          this.currentNameSubject.next('');
          this.currentEmailSubject.next('');
          this.currentRoleSubject.next('');
          this.isLoggedInSubject.next(false);
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Failed to logout:', error);
          // Handle the logout error, e.g., show an error message
          // You can still perform the logout actions on the frontend if needed
          localStorage.removeItem(this.jwtTokenKey);
          this.currentNameSubject.next('');
          this.currentEmailSubject.next('');
          this.currentRoleSubject.next('');
          this.isLoggedInSubject.next(false);
          this.router.navigate(['/login']);
        }
      });
    } else {
      // If user ID is not available, perform the logout actions on the frontend
      localStorage.removeItem(this.jwtTokenKey);
      this.currentNameSubject.next('');
      this.currentEmailSubject.next('');
      this.currentRoleSubject.next('');
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  // Update the JWT token in local storage and emit user details
  updateLocalJWT(newToken: string): void {
    localStorage.setItem(this.jwtTokenKey, newToken);
    const decodedToken = this.decodeToken(newToken);
    if (decodedToken) {
      this.currentNameSubject.next(decodedToken.data.name);
      this.currentEmailSubject.next(decodedToken.data.email);
    }
  }

  // Get the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey);
  }

  // Get the current user ID from the JWT token
  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken) {
        console.log('Decoded Token:', decodedToken);
        console.log('User ID from JWT:', decodedToken.data.id);
        return decodedToken.data.id;
      }
    }
    return null;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  // Get the user's name as an observable
  getUserName(): Observable<string> {
    return this.currentName$;
  }

  // Get the user's role as an observable
  getUserRole(): Observable<string> {
    return this.currentRole$;
  }

  // Get the user's email as an observable
  getUserEmail(): Observable<string> {
    return this.currentEmail$;
  }
}