import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'C:/xampp/htdocs/warehouse/src/app/auth.service'; 
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response) => {
          if (response.token) {
        
            this.router.navigate(['/profile']).then(() => {
            
             
            });

          } else {
            this.errorMessage = response.message || 'Login failed. Please try again.';
          }
        },
        error: (err) => {
          this.errorMessage = 'An error occurred during login. Please try again later.';
          console.error('Login error:', err);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
