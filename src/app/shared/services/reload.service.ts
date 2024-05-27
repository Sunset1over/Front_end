import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  reload(): void {
    window.location.reload();
  }
}
