import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-confirm-dialog.html',
})
export class DeleteConfirmDialog {}