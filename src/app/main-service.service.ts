import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  constructor() {
  }

  myLogin = {
    name: '',
    address: ''
  }

  cars = [
    'Ford', 'Chevrolet', 'Buick'
  ];

  getLogin() {
    return this.myLogin;
  }

  saveLogin(name, address) {
    this.myLogin.name = name;
    this.myLogin.address = address;
  }

}
