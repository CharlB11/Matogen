import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service'; 
import { UserService } from 'C:/xampp/htdocs/warehouse/src/user.service';
import { Observable } from 'rxjs';
import { ProductMessageService } from 'C:/xampp/htdocs/warehouse/src/app/product-message.service';

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
    private userService: UserService,
    private productMessageService: ProductMessageService
  ) {
  
    this.currentName$ = this.authService.currentName$;
    this.currentEmail$ = this.authService.currentEmail$; 
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    });

    // Subscribe to currentName$ and currentEmail$ to populate the form
    this.currentName$.subscribe(name => {
      this.profileForm.patchValue({ name });
    });

    this.currentEmail$.subscribe(email => {
      this.profileForm.patchValue({ email });
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
            
            if (response.newToken) {
              this.authService.updateLocalJWT(response.newToken);
            }
          } else {
            this.productMessageService.showDuplicateEmail();
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }
}