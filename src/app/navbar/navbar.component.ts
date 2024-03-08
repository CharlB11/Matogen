import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'C:/xampp/htdocs/warehouse/src/app/auth.service'

@Component({
  selector: 'app-navbar', // Adjust as necessary
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean> | undefined;
  userName$: Observable<string> | undefined; 
  role$: Observable<string> | undefined; 
  dropdownOpen = false;
role: any;
userName: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userName$ = this.authService.currentName$;
    this.role$ = this.authService.currentRole$;
  }
  toggleDropdown(open: boolean): void {
    this.dropdownOpen = open;
  }

  logout() {
    this.authService.logout();
  }
}
