import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL of the API endpoint
  private apiUrl = 'http://localhost/warehouse/php/index.php';

  constructor(private http: HttpClient) { }

  // Update user profile
  updateUserProfile(userData: { id: string; name: string; email: string; }): Observable<any> {
    const payload = {
      ...userData,
      action: 'updateUserProfile'
    };
    return this.http.post(this.apiUrl, payload, { responseType: 'text' });
  }

  // Get user profile
  getUserProfile(id: string): Observable<any> {
    const payload = {
      action: 'getUserProfile', 
      id: id
    };
    return this.http.post(this.apiUrl, payload);
  }

  // Register a new user
  registerUser(userData: any): Observable<any> {
    const payload = {
      ...userData,
      action: 'register'
    };
    return this.http.post(this.apiUrl, payload);
  }

  // Login user
  loginUser(credentials: { email: string, password: string }): Observable<any> {
    const payload = {
      ...credentials,
      action: 'login'
    };
    return this.http.post(this.apiUrl, payload);
  }

  // Logout user
  logoutUser(id: number): Observable<any> {
    const payload = {
      id: id,
      action: 'logout'
    };
    return this.http.post(this.apiUrl, payload, { responseType: 'text' });
  }
}