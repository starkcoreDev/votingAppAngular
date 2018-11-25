import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {CommonModule} from '@angular/common';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {MainServiceService} from '../../main-service.service';
import {MatSnackBar} from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';


@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  name = '';
  address = '';

  constructor(private router: Router, private mainService: MainServiceService, public snackBar: MatSnackBar) {
  }

  // Public variables
  candidateList = [];
  showLoading = false;
  candidateAddress = '';
  candidateId = 0;
  isCandidate = false;


  /**
   * Main Save candidat function, records data on the blockchain
   */
  saveCandidate = () => {
    // TODO:Check the candidate information
    if (this.candidateAddress.length > 42 && Number.isInteger(this.candidateId)) {

      this.showLoading = true;
      // Let user know the process is being saved in blockchain
      let snackBarInProgress = this.snackBar.open("Your selection is being recorded on the blockchain...");
      // Alert once finished
      setTimeout(() => {
        let snackBarFinished = this.snackBar.open("Saved FOREVER in the blockchain!",'',{
          duration: 3000
        });
        this.showLoading = false;
      }, 4000);
      
    } else {
      // Small error in input data
      let snackBarFinished = this.snackBar.open("You have a small error in your data, please check",'Error',{
        duration: 3000
      });
    }    
  }

  ngOnInit(): void {
    const registeredPerson = this.mainService.getLogin();
    // Check for login here
    if (!registeredPerson) {
      // Navigate back to login if false
      this.router.navigate(['/login']);
    }

    // choose starting  behavior    
    this.name = registeredPerson.name;
    this.address = registeredPerson.address;
    this.isCandidate = registeredPerson.isCandidate;

    this.candidateList = [{
      name: "Test",
      address: "0x123456789101112131415",
      isCandidate: false,
      voted: false
    }]

  }
}
