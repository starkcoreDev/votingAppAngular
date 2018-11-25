import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {MainServiceService} from './main-service.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public mainService: MainServiceService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    // Check for login here
    if (!this.mainService.getLogin()) {
      // Navigate back to login if false
      this.router.navigate(['/login']);
    }
  }
}
