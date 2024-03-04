import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service'; 
import { UserService } from 'C:/xampp/htdocs/warehouse/src/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentName$: Observable<string>; // To hold the current name as an Observable
  currentEmail$: Observable<string>; // To hold the current email as an Observable

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
  
    this.currentName$ = this.authService.getUserName();
    this.currentEmail$ = this.authService.getUserEmail(); 
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    });
  }

onSubmit() {
  if (this.profileForm.valid) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.error('User ID is not available for profile update.');
      return;
    }

    const updateData = { id: userId, ...this.profileForm.value };
    this.userService.updateUserProfile(updateData).subscribe({
      next: (responseText: string) => {
        const response = JSON.parse(responseText);
        if (response.status === 'success') {
          console.log('Profile updated successfully', response);
          // Update user details in AuthService
          this.authService.updateUserNameAndEmail(this.profileForm.value.name, this.profileForm.value.email);
          
          if (response.newToken) {
            this.authService.updateLocalJWT(response.newToken);
          }
          window.location.reload();
        } else {
          console.error('Failed to update profile:', response.message);
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      }
    });
  }
}
}