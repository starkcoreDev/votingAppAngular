import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { MainServiceService } from "../../main-service.service";
import { MatSnackBar } from "@angular/material";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from "rxjs";
export interface candidateList {
  name: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {
  candidateList: Observable<any[]>;
  constructor(
    private router: Router,
    private mainService: MainServiceService,
    public snackBar: MatSnackBar,
    public db: AngularFireDatabase
  ) {}

  // Configuration parameters
  color = "accent";
  // Interaction variables
  public myLogin = {
    name: "",
    address: "",
    isCandidate: false,
    voted: false
  };
  // Register the user, alert the user if the wrong hash is entered
  register = () => {
    if (this.myLogin.name.length < 4 || this.myLogin.address.length < 42) {
      let snackBarFinished = this.snackBar.open(
        "Your input credentials seem to have something wrong, please double check",
        "Error",
        {
          duration: 3000
        }
      );
    } else {
      // Check if it exists
      this.db
        .list("/voters", ref =>
          ref.orderByChild("address").equalTo(this.myLogin.address)
        )
        .valueChanges()
        .subscribe(exists => {
          // Check if exists
          if (exists.length === 0) {
            this.myLogin = {
              name: this.myLogin.name,
              address: this.myLogin.address,
              isCandidate: this.myLogin.isCandidate,
              voted: false
            };
            // // Save data to localstorage as well
            this.mainService.saveLogin(
              this.myLogin.name,
              this.myLogin.address
            );

            // Save data to firebase
            const itemsRef = this.db.list("voters");
            itemsRef.push(this.myLogin);

            this.router.navigate(["/dashboard"]);
          } else {
            // Exists alert the user he cannot cheat
            let snackBarFinished = this.snackBar.open(
              "It looks like you signed up already! Redireceting you in 3 seconds",
              "Already signed up",
              {
                duration: 3000
              }
            );
            this.mainService.saveLogin(this.myLogin.name, this.myLogin.address);
            setTimeout(() => {
              this.router.navigate(["/dashboard"]);
            }, 3000);
            // Let the rest of the application know that he CANNOT vote anymore
          }
        });
    }
  };
  // Upong switching to a candidate
  public onChangeToggleState = () => {
    this.myLogin.isCandidate = !this.myLogin.isCandidate;
  };

  // Check for login on every refresh
  ngOnInit = () => {};
}
