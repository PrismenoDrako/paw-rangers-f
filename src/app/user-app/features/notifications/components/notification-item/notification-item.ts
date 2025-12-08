import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_CONFIG, DEFAULT_CATEGORY_CONFIG, NotificationCategory } from '../../constants/category.config';
import { NotificationItem } from '../../models/notification.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.scss']
})
export class NotificationItemComponent {
  private readonly assetBasePath = 'assets/img/';

  @Input() notification!: NotificationItem;
  @Output() notificationClick = new EventEmitter<NotificationItem>();
  @Output() openDetail = new EventEmitter<NotificationItem>();

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

  onCardClick(): void {
    this.notificationClick.emit(this.notification);
  }

  onOpenDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.openDetail.emit(this.notification);
  }

  get categoryConfig() {
    return CATEGORY_CONFIG[this.notification.category as NotificationCategory] ?? DEFAULT_CATEGORY_CONFIG;
  }
}
