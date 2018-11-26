import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { MainServiceService } from "../../main-service.service";
import { MatSnackBar } from "@angular/material";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from "rxjs";

@Component({
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private mainService: MainServiceService,
    public snackBar: MatSnackBar,
    public db: AngularFireDatabase
  ) {}

  // Public variables
  showLoading = false;
  candidateAddress = "";
  candidateId = 0;
  isCandidate = false;
  name = "";
  address = "";
  voted = false;
  public candidateList: Observable<any[]>;

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
      this.candidateAddress.length > 42 &&
      Number.isInteger(this.candidateId)
    ) {
      this.showLoading = true;
      // Let user know the process is being saved in blockchain
      let snackBarInProgress = this.snackBar.open(
        "Your selection is being recorded on the blockchain..."
      );
      // TODO: Save in dataStore

      // Alert once finished
      setTimeout(() => {
        let snackBarFinished = this.snackBar.open(
          "Saved FOREVER in the blockchain!",
          "",
          {
            duration: 3000
          }
        );
        this.showLoading = false;
      }, 4000);
    } else {
      // Small error in input data
      let snackBarFinished = this.snackBar.open(
        "You have a small error in your data, please check",
        "Error",
        {
          duration: 3000
        }
      );
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
          console.log("voter is", voter);
          // choose starting  behavior
          this.name = voter.name;
          this.address = voter.address;
          this.isCandidate = voter.isCandidate;
          this.voted = voter.voted;
        }
      });

    this.databaseChange();
  }
}
