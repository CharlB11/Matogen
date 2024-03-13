import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initialize the login form with form controls and validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      // If the form is valid, call the login method of the AuthService
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response) => {
          if (response.token) {
            // If the login is successful and a token is received, navigate to the profile page
            this.router.navigate(['/profile']);
          } else {
            // If the login fails, display an error message
            this.errorMessage = response.message || 'Login failed. Please try again.';
          }
        },
        error: (err) => {
          // If an error occurs during login, display a generic error message and log the error
          this.errorMessage = 'An error occurred during login. Please try again later.';
          console.error('Login error:', err);
        }
      });
    } else {
      // If the form is invalid, display an error message
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}