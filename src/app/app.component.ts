import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'warehouse';

  constructor(private authService: AuthService, private el: ElementRef) {}

  ngOnInit() {
    this.createMouseFollower();
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