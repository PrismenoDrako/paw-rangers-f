import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { SimilarPet } from '../../../core/services/similarity.service';

@Component({
  selector: 'app-similar-pets-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CardModule,
    RatingModule
  ],
  templateUrl: './similar-pets-modal.html',
  styleUrl: './similar-pets-modal.scss'
})
export class SimilarPetsModalComponent {
  @Input() visible: boolean = false;
  @Input() similarPets: SimilarPet[] = [];
  @Input() isFoundReport: boolean = true; // true si es reporte de hallazgo, false si es pérdida
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() petSelected = new EventEmitter<SimilarPet>();

  getTitle(): string {
    return this.isFoundReport 
      ? '¡Mascotas perdidas similares!' 
      : '¡Mascotas encontradas similares!';
  }

  getDescription(): string {
    return this.isFoundReport
      ? 'Hemos encontrado estas mascotas perdidas que tienen similitudes con tu reporte'
      : 'Hemos encontrado estas mascotas encontradas que tienen similitudes con tu mascota perdida';
  }

  onClose(): void {
    this.visibleChange.emit(false);
  }

  onPetSelected(pet: SimilarPet): void {
    this.petSelected.emit(pet);
    this.onClose();
  }

  getSimilarityColor(similarity: number): string {
    if (similarity >= 80) return '#16a34a'; // verde
    if (similarity >= 60) return '#ea580c'; // naranja
    return '#6b7280'; // gris
  }

  getSimilarityLabel(similarity: number): string {
    if (similarity >= 80) return 'Muy similar';
    if (similarity >= 60) return 'Bastante similar';
    return 'Similar';
  }
}
