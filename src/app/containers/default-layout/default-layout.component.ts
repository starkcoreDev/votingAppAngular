import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import {MatSnackBar} from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { MainServiceService } from "../../main-service.service";


@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html"
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(
    public snackBar: MatSnackBar,
    public mainService: MainServiceService
  ) {
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = document.body.classList.contains(
        "sidebar-minimized"
      );
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  public toggleDictator = () => {
    console.log("toggling dictator");
    this.mainService.toggleDictatorStatus();
  }

  public logout = () => {
    localStorage.removeItem("myLogin");
    let snackBarFinished = this.snackBar.open(
      "Logging out of the application",
      "LOG OUT",
      {
        duration: 3000
      }
    );
  };
}
