import { Injectable } from "@angular/core";
import { UserService } from "../user.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { throwError } from 'rxjs';
import { MyJwtPayload } from './my-jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentNameSubject = new BehaviorSubject<string>('');
  public currentName$ = this.currentNameSubject.asObservable();

  private currentRoleSubject = new BehaviorSubject<string>('');
  public currentRole$ = this.currentRoleSubject.asObservable();

  private currentEmailSubject = new BehaviorSubject<string>('');
  public currentEmail$ = this.currentEmailSubject.asObservable();

  private jwtTokenKey = 'currentUserToken';

  constructor(private userService: UserService, private router: Router) {
    this.checkAndEmitUserDetails();
  }

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

  private decodeToken(token: string): MyJwtPayload | null {
    try {
      return jwtDecode<MyJwtPayload>(token);
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }

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

  login(email: string, password: string): Observable<any> {
    return this.userService.loginUser({ email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.jwtTokenKey, response.token);
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
        return throwError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.jwtTokenKey);
    this.currentNameSubject.next('');
    this.currentEmailSubject.next('');
    this.currentRoleSubject.next('');
    this.isLoggedInSubject.next(false); 
    this.router.navigate(['/login']);
  }

  updateLocalJWT(newToken: string): void {
    localStorage.setItem(this.jwtTokenKey, newToken);
    const decodedToken = this.decodeToken(newToken);
    if (decodedToken) {
      this.currentNameSubject.next(decodedToken.data.name);
      this.currentEmailSubject.next(decodedToken.data.email);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey);
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken) {
        return decodedToken.data.id;
      }
    }
    return null;
  }

  
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }
  

  getUserName(): Observable<string> {
    return this.currentName$;
  }

  getUserRole(): Observable<string> {
    return this.currentRole$;
  }

  getUserEmail(): Observable<string> {
    return this.currentEmail$;
  }
}