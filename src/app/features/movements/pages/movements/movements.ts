import { Component, inject } from '@angular/core';
import { MovementsService } from '../../services/movements.service';
import { MaterialModule } from '../../../../shared/material/material-module';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [MaterialModule, RouterLink, DecimalPipe],
  selector: 'app-movements',
  styleUrl: './movements.scss',
  templateUrl: './movements.html',
})
export class Movements {
  private readonly movementsService = inject(MovementsService);

  readonly movements = this.movementsService.movements;
}
