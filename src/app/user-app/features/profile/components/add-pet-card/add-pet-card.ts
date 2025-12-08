import { Component, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-pet-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './add-pet-card.html',
  styleUrl: './add-pet-card.scss'
})
export class AddPetCardComponent {
    
    // 🚨 Evento que se emitirá cuando se haga clic
    @Output() addClicked = new EventEmitter<void>();

    /**
     * Maneja el clic en la tarjeta y emite el evento 'addClicked'.
     */
    onAddPet(): void {
        console.log('Emitiendo evento para abrir el formulario de nueva mascota.');
        this.addClicked.emit(); 
    }
}