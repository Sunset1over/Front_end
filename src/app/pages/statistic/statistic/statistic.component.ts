import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {StatisticRequestModel} from "../models/statisticRequest.model";
import {LoginStatisticResponseModel} from "../models/LoginStatisticResponse.model";
import {StatisticService} from "../services/statistic.service";
import {formatDate} from "@angular/common";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {SubscriptionStatisticResponseModel} from "../models/SubscriptionStatisticResponse.model";
import {RecommendationStatisticResponseModel} from "../models/RecommendationStatisticResponse.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss',
})
export class StatisticComponent implements OnInit{
  public chart: any;
  public today: string;
  protected currentRequest: StatisticRequestModel;

  constructor(private statisticService: StatisticService) {
    this.today = formatDate(new Date(), 'YYYY-MM-dd', 'en');
    this.currentRequest = {
      DateFrom: formatDate(new Date(), 'YYYY-MM-dd', 'en'),
      DateTo: formatDate(new Date(), 'YYYY-MM-dd', 'en')
    };
  }

  ngOnInit(): void {
    this.loadLoginStatistics();
  }

  onStatisticsTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedType = selectElement.value;

    switch (selectedType) {
      case 'login':
        this.loadLoginStatistics();
        break;
      case 'userInfo':
        this.loadUserInfoStatistics();
        break;
      case 'recommendation':
        this.loadRecommendationStatistics();
        break;
      default:
        break;
    }
  }

  onDateChange(): void {
    if (!this.currentRequest.DateFrom || !this.currentRequest.DateTo) {
      alert('Both dates must be selected');
      return;
    }

    if (this.currentRequest.DateFrom > this.currentRequest.DateTo) {
      alert('"From" date cannot be later than "To" date');
      return;
    }

    this.loadSelectedStatistics();
  }

  private loadSelectedStatistics(): void {
    const selectElement = document.getElementById('statisticsType') as HTMLSelectElement;
    const selectedType = selectElement.value;

    switch (selectedType) {
      case 'login':
        this.loadLoginStatistics();
        break;
      case 'userInfo':
        this.loadUserInfoStatistics();
        break;
      case 'recommendation':
        this.loadRecommendationStatistics();
        break;
      default:
        break;
    }
  }

  loadLoginStatistics(): void {
    this.statisticService.GetLoginStatistic(this.currentRequest).subscribe(
      (response: LoginStatisticResponseModel) => {
        this.createChart(response);
      },
      (error) => {
        console.error('Failed to retrieve login statistics', error);
      }
    );
  }

  loadUserInfoStatistics(): void {
    this.statisticService.GetUserInfoStatistic(this.currentRequest).subscribe(
      (response: SubscriptionStatisticResponseModel) => {
        this.createUserInfoChart(response);
      },
      (error) => {
        console.error('Failed to retrieve user info statistics', error);
      }
    );
  }

  loadRecommendationStatistics(): void {
    this.statisticService.GetRecommendationInfo(this.currentRequest).subscribe(
      (response: RecommendationStatisticResponseModel) => {
        this.createRecommendationChart(response);
      },
      (error) => {
        console.error('Failed to retrieve recommendation statistics', error);
      }
    );
  }

  createChart(data: LoginStatisticResponseModel): void {
    if (!data) return;

    const labels = data.monthlyLoginCount.map(item => formatDate(item.dateFrom, 'YYYY-MM-dd', 'en'));
    const registrations = data.monthlyLoginCount.map(item => item.monthTotalRegistrations);
    const logins = data.monthlyLoginCount.map(item => item.monthTotalLogins);

    this.renderChart(labels, [
      { label: 'Registrations', data: registrations, backgroundColor: 'blue' },
      { label: 'Logins', data: logins, backgroundColor: 'limegreen' }
    ]);
  }

   createUserInfoChart(data: SubscriptionStatisticResponseModel): void {
    if (!data) return;

    const labels = data.monthlyCounts.map(item => formatDate(item.dateFrom, 'YYYY-MM-dd', 'en'));
    const count = data.monthlyCounts.map(item => item.count);
     const totalAmount = data.monthlyCounts.map(item => item.totalAmount);

    this.renderChart(labels, [
      { label: 'count', data: count, backgroundColor: 'orange' },
      {label: 'totalAmount', data: totalAmount, backgroundColor: 'green' },
    ]);
  }

   createRecommendationChart(data: RecommendationStatisticResponseModel): void {
    if (!data) return;

    const labels = data.monthlyCounts.map(item => formatDate(item.dateFrom, 'YYYY-MM-dd', 'en'));
    const count = data.monthlyCounts.map(item => item.count);

    this.renderChart(labels, [
      { label: 'count', data: count, backgroundColor: 'purple' }
    ]);
  }

  renderChart(labels: string[], datasets: any[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }
}
