import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {MainServiceService} from '../../main-service.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private mainService: MainServiceService, public snackBar: MatSnackBar) {
  }

  // Configuration parameters
  color = 'accent';
  // Interaction variables
  public myLogin = {
    name: '',
    address: '',
    isCandidate: false
  }
  // Register the user, alert the user if the wrong hash is entered
  register = () =>{
    console.log('address', this.myLogin.name, 'address', this.myLogin.address, 'isCandidate', this.myLogin.isCandidate);
    if (this.myLogin.name.length < 4 || this.myLogin.address.length < 42) {
      let snackBarFinished = this.snackBar.open("Your input credentials seem to have something wrong, please double check",'Error',{
        duration: 3000
      });
    } else {
      // Save data to localstorage as well
      this.mainService.saveLogin(this.myLogin.name, this.myLogin.address, this.myLogin.isCandidate);
      this.router.navigate(['/dashboard']);
    }

  };
  // Upong switching to a candidate
  public onChangeToggleState = () => {
    this.myLogin.isCandidate = !this.myLogin.isCandidate;
  }

  // Check for login on every refresh
  ngOnInit = () => {

  }

}
