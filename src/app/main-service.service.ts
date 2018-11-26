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
    "0x7b1ba7090fc2bff23b699c74f1cb787c9755bccd";
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
          inputs: [],
          name: "becomeDictator",
          outputs: [],
          payable: true,
          stateMutability: "payable",
          type: "function"
        },
        {
          constant: false,
          inputs: [],
          name: "setVotingStatus",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
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
          name: "voteForCandidate",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: false,
          inputs: [],
          name: "getVotingStatus",
          outputs: [
            {
              name: "",
              type: "string"
            }
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "_name",
              type: "string"
            }
          ],
          name: "registerVoter",
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
          inputs: [],
          name: "getChairperson",
          outputs: [
            {
              name: "",
              type: "address"
            }
          ],
          payable: false,
          stateMutability: "view",
          type: "function"
        },
        {
          constant: true,
          inputs: [],
          name: "getNumberOfVoters",
          outputs: [
            {
              name: "",
              type: "uint256"
            }
          ],
          payable: false,
          stateMutability: "view",
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
              type: "bool"
            }
          ],
          payable: false,
          stateMutability: "view",
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
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              name: "msg",
              type: "string"
            }
          ],
          name: "dictatorEvnt",
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

    // Dictator event
    this.contract.events
      .dictatorEvnt({}, function(error, event) {})
      .on("data", function(event) {
        console.log("YOU HAVE BECOME A DICTATOR!"); // same results as the optional callback above
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
  };

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
  registerVoterBlockchain = name => {
    return new Promise((resolve, reject) => {
      const myLogin = this.getLogin();
      this.contract.methods
        .registerVoter(name)
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
    });
  };
  /**
   * Allows a user to become a dictator
   *
   * @memberof MainServiceService
   */
  becomeDictator = amount => {
    return new Promise((resolve, reject) => {
      const myLogin = this.getLogin();
      this.contract.methods
        .becomeDictator()
        .send({
          from: myLogin.address,
          value: this._web3.utils.toWei(amount, "ether")
        })
        .then(function(receipt) {
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          resolve(receipt);
          console.log(receipt);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  };

  /**
   * Gets the current state of the contract
   *
   * @memberof MainServiceService
   */
  getPollState = () => {
    const tempContract = this.contract;
    return new Promise((resolve, reject) => {
      const myLogin = this.getLogin();
      this.contract.methods
        .getVotingStatus().call()
        .then(function(receipt) {
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          resolve(receipt);
          console.log(receipt);
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });
    });
  };
}
