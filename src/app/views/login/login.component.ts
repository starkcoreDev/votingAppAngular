import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {MainServiceService} from '../../main-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  constructor(private router: Router, private mainService: MainServiceService) {
  }

  name = '';
  address = '';
  register = function () {
    console.log('address', this.name, 'address', this.address);
    if (this.name.length < 4 || this.address.length < 42) {
      alert('Not a valid input');
    } else {
      this.mainService.saveLogin(this.name, this.address);
      this.router.navigate(['/dashboard']);
    }

  };

}
