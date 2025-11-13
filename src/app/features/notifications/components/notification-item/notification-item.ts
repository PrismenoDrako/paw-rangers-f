import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.scss']
})
export class NotificationItemComponent {
  private readonly assetBasePath = 'assets/img/';

  @Input() notification: any;

  resolveImage(imagePath?: string): string {
    if (!imagePath?.trim()) {
      return '';
    }

    const normalized = imagePath.trim().toLowerCase();
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:')) {
      return imagePath;
    }

    return `${this.assetBasePath}${imagePath}`;
  }
}
