import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Navigation } from "../components/navigation/navigation";
import { ToastContainerComponent } from "../components/toast-container/toast-container.component";
import { NotificationHandlerService } from '../../core/services/notification-handler.service';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, Navigation, ToastContainerComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {
  constructor(private notificationHandler: NotificationHandlerService) {
    // El servicio se inicializa automáticamente en el constructor
    // y comienza a escuchar notificaciones en tiempo real
  }
}
