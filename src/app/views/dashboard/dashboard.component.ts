import {
  Component,
  OnInit,
  SecurityContext,
  ViewEncapsulation
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { MainServiceService } from "../../main-service.service";
import { MatSnackBar } from "@angular/material";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from "rxjs";
import { AlertConfig } from "ngx-bootstrap/alert";
import { DomSanitizer } from "@angular/platform-browser";

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: "success" });
}

@Component({
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private mainService: MainServiceService,
    public snackBar: MatSnackBar,
    public db: AngularFireDatabase,
    sanitizer: DomSanitizer
  ) {
    this.alertsHtml = this.alertsHtml.map((alert: any) => ({
      type: alert.type,
      msg: sanitizer.sanitize(SecurityContext.HTML, alert.msg)
    }));
  }
  // Non-used;
  alertsHtml: any = [];

  // Public variables
  showLoading = false;
  dictatorStatus = false;
  candidateAddress = "";
  candidateId = 0;
  valueToGiveToBecomeDictator = 0;
  dictatorMessage = {
    visible: false,
    loading: false,
    message:
      "You have become the dictator! There's absolutely not price so enjoy the recognition!"
  };
  ropstenAddress = "https://ropsten.etherscan.io/tx/";
  public voter = {
    name: "",
    address: "",
    voted: false,
    key: "",
    isCandidate: false,
    tx: ""
  };
  public candidateList: Observable<any[]>;


  /**
   * Function that allows you to become the dictaor by running a smart contract function and sending it some ether
   *
   * @memberof DashboardComponent
   */
  public becomeDictator = async value => {
    // Check for the value in the frontend
    if(this.valueToGiveToBecomeDictator < 20) {
      let snackBarFinishedOther = this.snackBar.open(
        "Stop being cheap, put in more ether",
        "Error",
        {
          duration: 5000
        }
      );
      throw new Error("Stop being cheap! ");
    }

    const hasBecomeDictator = await this.mainService.becomeDictator(
      this.valueToGiveToBecomeDictator
    );
    this.dictatorMessage.loading = true;
    if (hasBecomeDictator) {
      let snackBarFinishedOther = this.snackBar.open(
        "Saved FOREVER in the blockchain!",
        "",
        {
          duration: 5000
        }
      );
      this.dictatorMessage.loading = false;
      console.log("You have become the dictator");
      this.dictatorMessage.visible = true;
      // Update database to reflect new dictator status
      this.db
        .list("/voters", ref =>
          ref.orderByChild("address").equalTo(this.voter.address)
        )
        .valueChanges()
        .subscribe(exists => {
          // Check if exists
          if (exists.length > 0) {
            let voter: any = exists[0];
            const key = voter.key;
            voter.dictator = true;
            const dictatorRef = this.db.object("/voters/" + key);
            dictatorRef.update(voter);
          }
        });

    } else {
      console.log("Something happened and you did not become a dictator");
    }
  };

  /**
   *
   *
   * @memberof DashboardComponent
   */
  databaseChange = function() {
    this.candidateList = this.db.list("voters").valueChanges();
  };

  /**
   * Main Save candidat function, records data on the blockchain
   */
  saveCandidate = () => {
    // TODO:Check the candidate information
    if (
      (this.candidateAddress.length === 42 &&
        Number.isInteger(this.candidateId) &&
        this.voter.address !== this.candidateAddress,
      this.voter.voted === false)
    ) {
      // Save stuff on the databse for the candidate
      this.db
        .list("/voters", ref =>
          ref.orderByChild("address").equalTo(this.candidateAddress)
        )
        .valueChanges()
        .subscribe(async exists => {
          // Check if exists
          if (exists.length > 0) {
            let voter: any = exists[0];
            // Cannot vote for a non-candidate
            if (voter.isCandidate === false) {
              // Let the user know
              let snackBarFinished = this.snackBar.open(
                "You cannot vote for a non-candidate",
                "Error",
                {
                  duration: 3000
                }
              );
            } else {
              let candidate = { ...voter };
              candidate.votes = voter.votes + 1;
              // Update candidate info by getting the key
              const candidateRef = this.db.object("/voters/" + candidate.key);
              candidateRef.update(candidate);

              this.showLoading = true;
              // Let user know the process is being saved in blockchain
              let snackBarInProgress = this.snackBar.open(
                "Your selection is being recorded on the blockchain..."
              );

              // Alert once finished
              const blockchainTx: any = await this.mainService.registerVoterBlockchain(this.voter.name);
              // Verify the transactionw went througn and save
              if (blockchainTx) {
                voter.tx = blockchainTx.transactionHash;
                // Save stuff for the voter
                this.voter.voted = true;
                this.voter.tx = voter.tx;
                const voterRef = this.db.object("/voters/" + this.voter.key);
                voterRef.update(this.voter);
                this.showLoading = false;
                let snackBarFinishedOther = this.snackBar.open(
                  "Saved FOREVER in the blockchain!",
                  "",
                  {
                    duration: 5000
                  }
                );
              }
            }
          }
        });
    } else {
      // Small error in input data
      let snackBarFinished = this.snackBar.open(
        "You have a small error in your data, you tried to vote for yourself or you already voted, please check",
        "Error",
        {
          duration: 3000
        }
      );
      this.showLoading = false;
    }
  };

  ngOnInit(): void {
    console.log("WEB3!");
    const registeredPerson = this.mainService.getLogin();
    // Check for login here
    if (!registeredPerson) {
      // Navigate back to login if false
      this.router.navigate(["/login"]);
    }

    // SET STARTING BEHAVIOR BY LOOKUP UP THINGS WITH FIREBASE
    this.db
      .list("/voters", ref =>
        ref.orderByChild("address").equalTo(registeredPerson.address)
      )
      .valueChanges()
      .subscribe(exists => {
        // Check if exists
        if (exists.length > 0) {
          let voter: any = exists[0];
          this.voter = voter;
          voter.tx ? (this.ropstenAddress = this.ropstenAddress + voter.tx) : this.ropstenAddress = "No address recorder or error";
        }
        
      });

    this.databaseChange();

    // Set dictator status
    this.dictatorStatus = this.mainService.getDictatorStatus();
  }
}
