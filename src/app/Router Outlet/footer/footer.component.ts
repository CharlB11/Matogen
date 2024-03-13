import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  currentTime!: string; // Declare a property to store the current time as a string
  private timerId: any; // Declare a property to store the timer ID

  constructor() {}

  ngOnInit(): void {
    this.updateTime(); // Call the updateTime method to initialize the currentTime property
    this.timerId = setInterval(() => this.updateTime(), 1000); // Set up an interval to update the time every second
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId); // Clear the interval when the component is destroyed to prevent memory leaks
    }
  }

  private updateTime(): void {
    const now = new Date(); // Get the current date and time
    const year = now.getFullYear(); // Get the current year
    const month = this.pad(now.getMonth() + 1); // Get the current month (0-indexed) and pad it with a leading zero if needed
    const day = this.pad(now.getDate()); // Get the current day of the month and pad it with a leading zero if needed
    const hours = this.pad(now.getHours()); // Get the current hour and pad it with a leading zero if needed
    const minutes = this.pad(now.getMinutes()); // Get the current minute and pad it with a leading zero if needed
    const seconds = this.pad(now.getSeconds()); // Get the current second and pad it with a leading zero if needed
    this.currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Format the current time as a string
  }
  
  private pad(number: number): string {
    return number < 10 ? `0${number}` : number.toString(); // Add a leading zero to the number if it is less than 10
  }
  
}
