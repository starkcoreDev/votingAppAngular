import { Injectable } from "@angular/core";
import * as Web3 from "web3";
declare let require: any;
declare let window: any;
import * as tokenAbi from "../../contract.json";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

@Injectable({
  providedIn: "root"
})
export class MainServiceService {
  private _account: string = null;
  private _web3: any;
  private contract;
  public dictatorStatus = false;

  private _tokenContract: any;
  private _tokenContractAddress: string =
    "0x1384a1febaae2663f3ee7aded50cd82853e45ad8";
  public myLogin: any = {};

  constructor(public db: AngularFireDatabase) {

    // Initial declarations, holds the login data
    this.myLogin = {
      name: "",
      address: "",
      isCandidate: false,
      voted: false
    };

    if (typeof window.web3 !== "undefined") {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);

      // if (this._web3.version.network !== '3') {
      //   alert('Please connect to the Ropsten network');
      // }
    } else {
      console.warn(
        "Please use a dapp browser like mist or MetaMask plugin for chrome"
      );
    }
    // Set default account
    this._web3.eth.defaultAccount = this._web3.eth.accounts[0];

    // Get account test
    this._web3.eth
      .getAccounts()
      .then(result => {
        // the default account doesn't seem to be persisted, copy it to our
        // new instance
        // this._web3.eth.defaultAccount = window.web3.eth.defaultAccount;
        this._web3.eth.getBalance(result[0], (err, wei) => {
          const balance = this._web3.utils.fromWei(wei, "ether");
          console.log("balance", balance);
        });
      })
      .catch(err => {
        console.error("err", err);
      });

    // Read contract here
    this.contract = new this._web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              name: "candidateNumber",
              type: "uint256"
            }
          ],
          name: "voteForCandidate",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: true,
          inputs: [
            {
              name: "candidateNumber",
              type: "uint256"
            }
          ],
          name: "getCandidateInfo",
          outputs: [
            {
              name: "",
              type: "string"
            },
            {
              name: "",
              type: "uint256"
            },
            {
              name: "",
              type: "uint8"
            }
          ],
          payable: false,
          stateMutability: "view",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "candidateNumber",
              type: "uint256"
            }
          ],
          name: "becomeInCandidate",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: true,
          inputs: [
            {
              name: "_address",
              type: "address"
            }
          ],
          name: "getVoterInfo",
          outputs: [
            {
              name: "",
              type: "string"
            },
            {
              name: "",
              type: "uint256"
            },
            {
              name: "",
              type: "bool"
            }
          ],
          payable: false,
          stateMutability: "view",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "_name",
              type: "string"
            },
            {
              name: "_id",
              type: "uint256"
            }
          ],
          name: "registerVoter",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "constructor"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              name: "candidateName",
              type: "string"
            },
            {
              indexed: false,
              name: "votes",
              type: "uint256"
            }
          ],
          name: "newVote",
          type: "event"
        }
      ],
      this._tokenContractAddress
    );

    // Subscribe to events
    this.contract.events
      .newVote({}, function(error, event) {
        console.log(event);
      })
      .on("data", function(event) {
        console.log(event); // same results as the optional callback above
      })
      .on("changed", function(event) {
        // remove event from local database
      })
      .on("error", console.error);
  }

  // General functions
  public getDictatorStatus = () => {
    return this.dictatorStatus;
  };

  public toggleDictatorStatus = () => {
    this.dictatorStatus = !this.dictatorStatus;
  }

  /**
   * Login functions
   */

 

  public getLogin() {
    // Get from local storage, if it does not exist yet return false
    const myLogin = JSON.parse(localStorage.getItem("myLogin"));
    // Retrieve from database not from localStorage

    if (myLogin === null) {
      return false;
    } else {
      return myLogin;
    }
  }

  public saveLogin(name: string, address: string): void {
    // memory save (NOT USED)
    this.myLogin.name = name;
    this.myLogin.address = address;
    // storage save
    localStorage.setItem("myLogin", JSON.stringify(this.myLogin));
  }

  /**
   * Contract functions
   */

  /**
   * Register voter service
   *
   * @memberof MainServiceService
   */
  registerVoterBlockchain = () => {
    return new Promise((resolve, reject)=>{
      const myLogin = this.getLogin();
      this.contract.methods
        .registerVoter("Alfonso", 20)
        .send({ from: myLogin.address })
        .then(function(receipt) {
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          resolve(receipt);
          console.log(receipt);

        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    })
    
  };
  /**
   * Allows a user to become a dictator
   *
   * @memberof MainServiceService
   */
  becomeDictator = (amount) => {
    return new Promise((resolve, reject)=>{
      const myLogin = this.getLogin();
      this.contract.methods
        .becomeDictator()
        .send({ from: myLogin.address, value: this._web3.toWei(amount, "ether")})
        .then(function (receipt) {
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          resolve(receipt);
          console.log(receipt);

        })
        .catch(function (err) {
          console.error(err);
          reject(err);
        });
    })
  }

}
