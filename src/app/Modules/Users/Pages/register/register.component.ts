import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';

// Custom validator function to check for special characters in the password
function specialCharValidator(control: FormControl): { [key: string]: any } | null {
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/g.test(control.value);
  if (!hasSpecialChar) {
    return { 'noSpecialChar': { value: control.value } };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registrationError: string = '';

  constructor(
    private userService: UserService,
    private router: Router ) {}

  ngOnInit() {
    // Initialize the registration form with form controls and validators
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), specialCharValidator]),
      role: new FormControl('admin')
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // If the form is valid, call the registerUser method of the UserService
      this.userService.registerUser(this.registerForm.value).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            console.log('Registration successful', response);
            this.router.navigate(['/login']); // Redirect to login page after successful registration
          } else if (response.status === 'error') {
            // Set the registration error message if the registration fails
            this.registrationError = response.message; 
          }
        },
        error: (error: any) => { 
          // Handle any errors that occur during the registration process
          console.error('An error occurred during registration:', error);
          this.registrationError = 'An unexpected error occurred. Please try again.';
        }
      });
    } else {
      // If the form is invalid, set the registration error message
      this.registrationError = 'Please correct the errors in the form.';
    }
  }
  
}