import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snack = inject(MatSnackBar);

  success(message: string, action = 'OK'): void {
    this.snack.open(message, action, { duration: 3000, panelClass: ['toast-success'] });
  }

  error(message: string, action = 'OK'): void {
    this.snack.open(message, action, { duration: 5000, panelClass: ['toast-error'] });
  }

  info(message: string, action = 'OK'): void {
    this.snack.open(message, action, { duration: 3500 });
  }
}

