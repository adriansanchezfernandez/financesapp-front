import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MovementsService } from '../../../movements/services/movements.service';
import { MonthlySummary } from '../../models/monthly-summary.model';
import { effect, ElementRef, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MaterialModule } from '../../../../shared/material/material-module';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly selectedPeriod = signal<6 | 12 | 'all'>(6);
  private readonly movementsService = inject(MovementsService);

  readonly movements = this.movementsService.movements;

  readonly monthlySummary = computed(() => {
    const grouped = this.movements().reduce(
      (acc, movement) => {
        const mes = movement.fecha.slice(0, 7);

        if (!acc[mes]) {
          acc[mes] = {
            mes,
            ingresos: 0,
            gastos: 0,
          };
        }

        if (movement.tipo === 'ingreso') {
          acc[mes].ingresos += movement.cantidad;
        } else {
          acc[mes].gastos += movement.cantidad;
        }

        return acc;
      },
      {} as Record<string, MonthlySummary>
    );

    return Object.values(grouped).sort((a, b) =>
      a.mes.localeCompare(b.mes)
    );
  });

  readonly visibleMonthlySummary = computed(() => {
  const summary = this.monthlySummary();
  const period = this.selectedPeriod();

  if (period === 'all') {
    return summary;
  }

  return summary.slice(-period);
});

readonly chartCanvas =
  viewChild<ElementRef<HTMLCanvasElement>>('monthlyChart');

private chart?: Chart<'bar'>;
private readonly destroyRef = inject(DestroyRef);

constructor() {
  this.destroyRef.onDestroy(() => {
  this.chart?.destroy();
});

  effect(() => {
    const canvas = this.chartCanvas();
    const summary = this.visibleMonthlySummary();

    if (!canvas) return;

    if (this.chart) {
      this.chart.data.labels = summary.map(item => item.mes);
      this.chart.data.datasets[0].data = summary.map(item => item.ingresos);
      this.chart.data.datasets[1].data = summary.map(item => item.gastos);
      this.chart.update();
      return;
    }

    this.chart = new Chart(canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: summary.map(item => item.mes),
        datasets: [
          {
            label: 'Ingresos',
            data: summary.map(item => item.ingresos),
            backgroundColor: '#4caf50',
            borderRadius: 8,
            maxBarThickness: 35,
          },
          {
            label: 'Gastos',
            data: summary.map(item => item.gastos),
            backgroundColor: '#f44336',
            borderRadius: 8,
            maxBarThickness: 35
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
}

  ngOnInit(): void {
    this.movementsService.loadMovements();
  }
}