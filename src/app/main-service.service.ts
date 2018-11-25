import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  constructor() {
  }

  // Initial declarations, holds the login data
  myLogin = {
    name: '',
    address: '',
    isCandidate: false
  }

  public getLogin() {
    // Get from local storage, if it does not exist yet return false
    const myLogin = JSON.parse(localStorage.getItem('myLogin'))
    if ( myLogin === null) {
      return false
    } else {
      return myLogin;
    }    
  }

  public saveLogin(name: string, address: string, isCandidate: boolean): void {
    // memory save (NOT USED)
    this.myLogin.name = name;
    this.myLogin.address = address;
    this.myLogin.isCandidate = isCandidate;
    // storage save
    localStorage.setItem('myLogin', JSON.stringify(this.myLogin));
  }

}
