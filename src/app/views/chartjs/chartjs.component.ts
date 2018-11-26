import { Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {MainServiceService} from '../../main-service.service';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from "rxjs";
import * as _ from "lodash";

@Component({
  templateUrl: "chartjs.component.html"
})
export class ChartJSComponent implements OnInit {
  constructor(
    public router: Router,
    public mainService: MainServiceService,
    public db: AngularFireDatabase
  ) {}

  // Public initiation variables
  public candidateList: Observable<any[]>;
  public realCandidateList = [];
  public winner = {};
  public isDataAvailable : boolean = false;

  /**
   *
   *
   * @memberof DashboardComponent
   */
  databaseChange = function() {
    this.candidateList = this.db
      .list("/voters", ref => ref.orderByChild("isCandidate").equalTo(true))
      .valueChanges()
      .subscribe(list => {
        // Make the data available to the template
        
        this.realCandidateList = list;
        // Map the names of the candidates
        const candidateNames = _.map(this.realCandidateList, "name");
        const candidateVotes = _.map(this.realCandidateList, candidate => {
          return Number(candidate.votes);
        });
        this.doughnutChartLabels = candidateNames;
        this.doughnutChartData = candidateVotes;
        this.isDataAvailable = true;
      });
  };

  /**
   *Gets winner based un number of votes
   *
   * @memberof ChartJSComponent
   */
  getWinner = function() {
    // Lopp through real candidate list and find the one with the greatest number
    const winner = _.maxBy(this.realCandidateList, "votes");
    this.winner = winner;
    console.log("winner", winner);
  };

  public ngOnInit() {
    console.log("Entering on init for chartjs");
    const registeredPerson = this.mainService.getLogin();
    // Check for login here
    if (!registeredPerson) {
      // Navigate back to login if false
      this.router.navigate(["/login"]);
    }

    // Load the candidate result data
    this.databaseChange();
    // TODO: Ugly implementation due to time constraint
    setTimeout(() => {
      this.getWinner();
    }, 2000);
  }

  // lineChart
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
    { data: [18, 48, 77, 9, 100, 27, 40], label: "Series C" }
  ];
  public lineChartLabels: Array<any> = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)"
    },
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];
  public lineChartLegend = true;
  public lineChartType = "line";

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012"
  ];
  public barChartType = "bar";
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" }
  ];

  // Doughnut
  public doughnutChartLabels: string[] = [
    "Download Sales",
    "In-Store Sales",
    "Mail-Order Sales"
  ];

  // Start preparing information for donut chart

  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = "doughnut";

  // Radar
  public radarChartLabels: string[] = [
    "Eating",
    "Drinking",
    "Sleeping",
    "Designing",
    "Coding",
    "Cycling",
    "Running"
  ];

  public radarChartData: any = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: "Series A" },
    { data: [28, 48, 40, 19, 96, 27, 100], label: "Series B" }
  ];
  public radarChartType = "radar";

  // Pie
  public pieChartLabels: string[] = [
    "Download Sales",
    "In-Store Sales",
    "Mail Sales"
  ];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = "pie";

  // PolarArea
  public polarAreaChartLabels: string[] = [
    "Download Sales",
    "In-Store Sales",
    "Mail Sales",
    "Telesales",
    "Corporate Sales"
  ];
  public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
  public polarAreaLegend = true;

  public polarAreaChartType = "polarArea";

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
