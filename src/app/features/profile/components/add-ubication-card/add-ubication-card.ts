import { Component, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-ubication-card', // Selector corregido
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './add-ubication-card.html',
  styleUrl: './add-ubication-card.scss'
})
export class AddUbicationCardComponent { // Clase corregida
    // Evento que se emitirá cuando se haga clic
    @Output() addClicked = new EventEmitter<void>();

    onAddLocation(): void {
        console.log('Emitiendo evento para abrir el formulario de nueva ubicación.');
        this.addClicked.emit(); 
    }
}