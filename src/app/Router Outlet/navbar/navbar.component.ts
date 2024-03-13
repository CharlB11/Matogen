import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../Modules/Users/Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // Observable to track login status
  isLoggedIn$: Observable<boolean> | undefined;
  // Observable to get the current user's name
  userName$: Observable<string> | undefined;
  // Observable to get the current user's role
  role$: Observable<string> | undefined;
  // Flag to control the dropdown state
  dropdownOpen = false;
  // Variables to store the user's role and name
  role: any;
  userName: any;

  // Inject the AuthService and ElementRef in the constructor
  constructor(private authService: AuthService, private elementRef: ElementRef) {}

  ngOnInit() {
    // Initialize the observables
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userName$ = this.authService.currentName$;
    this.role$ = this.authService.currentRole$;
  }

  // Method to toggle the dropdown state
  toggleDropdown(open: boolean): void {
    this.dropdownOpen = open;
  }

  // HostListener to listen for click events on the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Get the clicked target element
    const targetElement = event.target as HTMLElement;
    // Check if the clicked element is outside the component
    if (!this.elementRef.nativeElement.contains(targetElement)) {
      // Close the dropdown if clicked outside
      this.dropdownOpen = false;
    }
  }

  // Method to handle user logout
  logout() {
    this.authService.logout();
  }
}