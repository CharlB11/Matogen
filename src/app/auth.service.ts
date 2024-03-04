import { Injectable } from "@angular/core";
import { UserService } from "../user.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // This is the new import
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MyJwtPayload } from './my-jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject to track login state, initially set based on presence of token in storage
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  // BehaviorSubject for current user ID, allowing for reactive updates and access
  private currentIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public currentId$: Observable<string | null> = this.currentIdSubject.asObservable();

  // BehaviorSubject for storing current user details, accessible as an Observable
  private currentUserDetailsSource = new BehaviorSubject<any>(null);
  public currentUserDetails$ = this.currentUserDetailsSource.asObservable();

  // Key used for storing JWT token in local storage
  private jwtTokenKey = 'currentUserToken';

  // BehaviorSubjects for user's name and email for reactive updates
  private currentNameSubject = new BehaviorSubject<string>('');
  private currentEmailSubject = new BehaviorSubject<string>('');

  constructor(private userService: UserService, private router: Router) {
    // Initialize isLoggedInSubject based on the token's presence to set initial login state
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    this.emitCurrentUserDetails(); // Emit current user details if token exists
  }

  // Method to update user's name and email
  updateUserNameAndEmail(name: string, email: string) {
    this.currentNameSubject.next(name);
    this.currentEmailSubject.next(email);
  }
  
  // Emits user details by decoding JWT token from local storage, if available
  emitCurrentUserDetails(): void {
    const token = this.getToken();
    if (token) {
      const decoded = jwtDecode<MyJwtPayload>(token); 
      if (decoded) {
        // Update BehaviorSubjects with decoded information
        this.currentNameSubject.next(decoded.name);
        this.currentEmailSubject.next(decoded.email);
        this.currentUserDetailsSource.next(decoded);
      }
    } else {
      this.currentUserDetailsSource.next(null);
    }
  }

  // Updates JWT token in local storage and refreshes user details
  updateLocalJWT(newToken: string): void {
    localStorage.setItem(this.jwtTokenKey, newToken);
    this.emitCurrentUserDetails(); // Re-emit user details based on new token
  }

  // Checks if a JWT token is present in local storage
  private hasToken(): boolean {
    return !!localStorage.getItem(this.jwtTokenKey);
  }

  // Handles user login, storing the token and user ID upon success
  login(email: string, password: string): Observable<any> {
    return this.userService.loginUser({ email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // Store token and decode it to update user information
          localStorage.setItem(this.jwtTokenKey, response.token);
          const decoded = jwtDecode<MyJwtPayload>(response.token);
          this.currentIdSubject.next(decoded.data?.id); // Update current user ID
          this.isLoggedInSubject.next(true); // Update login state
        }
      }),
      catchError(error => {
        return throwError(error); // Handle login error
      })
    );
  }

  // Retrieves the current user ID from the JWT token
  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = jwtDecode<MyJwtPayload>(token);
      return decoded.data?.id || null;
    }
    return null;
  }

  // Logs out the user, clearing stored token and user details
  logout(): void {
    localStorage.removeItem(this.jwtTokenKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Reload the page to reset the application state
    });
  }

  // Checks if the JWT token has expired
  isTokenExpired(token: string): boolean {
    const decoded = jwtDecode<MyJwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  // Checks the token for expiry and logs out if necessary
  checkAndHandleTokenExpiry(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.logout(); // Logout if token has expired
    }
  }

  // Returns true if the user is logged in and the token hasn't expired
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  // Retrieves the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey);
  }

  // Retrieves the user's name from the JWT token and returns it as an Observable.
getUserName(): Observable<string> {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken: MyJwtPayload = jwtDecode<MyJwtPayload>(token);
      const name = decodedToken.data?.name || 'Fallback Name';
      return of(name);
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }
  return of(''); // Return an empty string if there's no token or in case of an error
}

// Retrieves the user's role from the JWT token and returns it as an Observable.
getUserRole(): Observable<string> {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken: MyJwtPayload = jwtDecode<MyJwtPayload>(token);
      const role = decodedToken.data?.role || 'Fallback Role';
      return of(role);
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }
  return of(''); // Return an empty string if there's no token or in case of an error
}

// Retrieves the user's ID from the JWT token and returns it as an Observable.
getUserId(): Observable<string> {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken: MyJwtPayload = jwtDecode<MyJwtPayload>(token);
      const id = decodedToken.data?.id || ''; // Use an empty string as fallback if id is undefined
      return of(id);
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }
  return of(''); // Return an empty string if there's no token or in case of an error
}

// Retrieves the user's email from the JWT token and returns it as an Observable.
getUserEmail(): Observable<string> {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken: MyJwtPayload = jwtDecode<MyJwtPayload>(token);
      const email = decodedToken.data?.email || ''; // Use an empty string as fallback if email is undefined
      return of(email);
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }
  return of(''); // Return an empty string if there's no token or in case of an error
}
}