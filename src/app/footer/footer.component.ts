import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  currentTime!: string;
  private timerId: any;

  constructor() {}

  ngOnInit(): void {
    this.updateTime();
    this.timerId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateTime(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = this.pad(now.getMonth() + 1);
    const day = this.pad(now.getDate());
    const hours = this.pad(now.getHours());
    const minutes = this.pad(now.getMinutes());
    const seconds = this.pad(now.getSeconds());
    this.currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  private pad(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }
  
}
