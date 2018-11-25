import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(public snackBar: MatSnackBar) {
    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

  }

  public logout = () => {
      localStorage.removeItem('myLogin');
      let snackBarFinished = this.snackBar.open("Logging out of the application",'LOG OUT',{
        duration: 3000
      });
  }
}
