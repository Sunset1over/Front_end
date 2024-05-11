import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {StatisticRequestModel} from "../models/statisticRequest.model";
import {LoginStatisticResponseModel} from "../models/LoginStatisticResponse.model";
import {StatisticService} from "../services/statistic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss',
})
export class StatisticComponent implements OnInit{
  public chart: any;

  constructor(private route: ActivatedRoute, private router: Router, private statisticService: StatisticService) {}

  ngOnInit(): void {
    const request: StatisticRequestModel = {
      DateFrom: formatDate(new Date('2024-04-01'), 'YYYY-MM-dd', 'en'),
      DateTo: formatDate(new Date('2024-07-01'), 'YYYY-MM-dd', 'en')
    };

    this.statisticService.GetLoginStatistic(request).subscribe(
      (response: LoginStatisticResponseModel) => {
        this.createChart(response);
      },
      (error) => {
        console.error('Failed to retrieve login statistics', error);
      }
    );
  }

  createChart(Data: LoginStatisticResponseModel) {
    if (!Data) return;

    const labels = Data.monthlyLoginCount.map(item => formatDate(item.dateFrom, 'YYYY-MM-dd', 'en'));
    const registrations = Data.monthlyLoginCount.map(item => item.monthTotalRegistrations);
    const logins = Data.monthlyLoginCount.map(item => item.monthTotalLogins);

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Registrations",
            data: registrations,
            backgroundColor: 'blue'
          },
          {
            label: "Logins",
            data: logins,
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }
}
