import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'warehouse';

  constructor(private authService: AuthService, private el: ElementRef) {}

  ngOnInit() {
    this.checkTokenExpirationAndLogout();
    this.createMouseFollower();

  }

  checkTokenExpirationAndLogout() {
    // Check token expiration on app start
    const token = localStorage.getItem('currentUserToken');
    if (token && this.authService.isTokenExpired(token)) {
      this.authService.logout(); 
    }

    // Set up an interval for periodic checks
    setInterval(() => {
      const token = localStorage.getItem('currentUserToken');
      if (token && this.authService.isTokenExpired(token)) {
        this.authService.logout();
      }
    }, 60000); // Check every 60 seconds as an example
  }
  createMouseFollower() {
    const follower = document.createElement('div');
    follower.style.position = 'absolute';
    follower.style.width = '20px';
    follower.style.height = '20px';
    follower.style.borderRadius = '50%';
    follower.style.backgroundColor = '#3FC060';
    follower.style.pointerEvents = 'none';
    follower.style.boxShadow = '0 0 10px 5px #3FC060';
    this.el.nativeElement.appendChild(follower);

    this.el.nativeElement.addEventListener('mousemove', (e: { clientX: number; clientY: number; }) => {
      follower.style.left = `${e.clientX - 10}px`;
      follower.style.top = `${e.clientY - 10}px`;
    });
  }
}
