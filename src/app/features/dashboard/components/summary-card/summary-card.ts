import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material-module';


@Component({
  selector: 'app-summary-card',
  imports: [MaterialModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
    standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryCard {
  title = input<string>();
  value = input<string>();
  icon = input<string>('account_balance_wallet');
}