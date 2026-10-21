import { Component } from '@angular/core';
import { SummaryCard } from '../../components/summary-card/summary-card';

@Component({
  imports: [SummaryCard],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
