  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  
  @Injectable({
    providedIn: 'root'
  })
  export class UserService {
    
    private apiUrl = 'http://localhost/warehouse/php/index.php';
  
    constructor(private http: HttpClient) { }

    updateUserProfile(userData: { id: string; name: string; email: string; }): Observable<any> {
      const payload = {
        ...userData,
        action: 'updateUserProfile'
      };
      return this.http.post(this.apiUrl, payload, { responseType: 'text' });
    }
  
    getUserProfile(id: string): Observable<any> {
      const payload = {
        action: 'getUserProfile', 
        id: id
      };
      return this.http.post(this.apiUrl, payload);
    }
  
    registerUser(userData: any): Observable<any> {
      const payload = {
        ...userData,
        action: 'register' // Register action
      };
      return this.http.post(this.apiUrl, payload);
    }
  
    loginUser(credentials: { email: string, password: string }): Observable<any> {
      const payload = {
        ...credentials,
        action: 'login' // Login action
      };
      return this.http.post(this.apiUrl, payload);
    }
    logoutUser(id: string): Observable<any> {
      const payload = {
        action: 'logout', // Logout action
        id: id
      };
      return this.http.post(this.apiUrl, payload, { responseType: 'text' });
    }
    
  
  }