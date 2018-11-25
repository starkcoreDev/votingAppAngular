import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {MainServiceService} from '../../main-service.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  name = '';
  address = '';

  constructor(private router: Router, private mainService: MainServiceService) {
  }

  ngOnInit(): void {
    // choose starting  behavior
    console.log('display information saved on service', this.mainService.getLogin());
    const registeredPerson = this.mainService.getLogin();
    this.name = registeredPerson.name;
    this.address = registeredPerson.address;

  }
}
