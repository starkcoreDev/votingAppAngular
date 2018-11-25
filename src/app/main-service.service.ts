import {Injectable} from '@angular/core';
import * as Web3 from 'web3';
declare let require: any;
declare let window: any;
import * as tokenAbi from '../contract.json';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  private _account: string = null;
  private _web3: any;

  private _tokenContract: any;
  private _tokenContractAddress: string = "0x200f300686ba4037aaec76ec30eed760e873a069";

  constructor() {

    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);

      // if (this._web3.version.network !== '4') {
      //   alert('Please connect to the Ropsten network');
      // }
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }
    this._web3.eth.getAccounts().then((result)=>{
      console.log("result", result);
    }).catch((err)=>{
      console.error("err", err);
    })
    
    // Read contract here
  }

  /**
   * Login functions
   */

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

  /**
   * Contract functions
   */

   



}
