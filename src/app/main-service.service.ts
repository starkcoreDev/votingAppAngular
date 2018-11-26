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

  private _tokenContract: any;
  private _tokenContractAddress: string =
    "0x0a074ce739ad522012b2085ba495395c6edba142";

  constructor(public db: AngularFireDatabase) {
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
    const contract = new this._web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              name: "to",
              type: "address"
            }
          ],
          name: "delegate",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: true,
          inputs: [],
          name: "winningProposal",
          outputs: [
            {
              name: "_winningProposal",
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
              name: "toVoter",
              type: "address"
            }
          ],
          name: "giveRightToVote",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "toProposal",
              type: "uint8"
            }
          ],
          name: "vote",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              name: "_numProposals",
              type: "uint8"
            }
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "constructor"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "_from",
              type: "address"
            },
            {
              indexed: false,
              name: "_value",
              type: "uint256"
            }
          ],
          name: "Test",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              name: "text",
              type: "string"
            }
          ],
          name: "VoteWorked",
          type: "event"
        }
      ],
      this._tokenContractAddress
    );

    // Subscribe to events
    contract.events
      .VoteWorked({}, function(error, event) {
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

  /**
   * Login functions
   */

  // Initial declarations, holds the login data
  myLogin = {
    name: "",
    address: "",
    isCandidate: false,
    voted: false
  };

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

  public saveLogin(
    name: string,
    address: string
  ): void {
    // memory save (NOT USED)
    this.myLogin.name = name;
    this.myLogin.address = address;
    // storage save
    localStorage.setItem("myLogin", JSON.stringify(this.myLogin));
  }

  /**
   * Contract functions
   */
}
