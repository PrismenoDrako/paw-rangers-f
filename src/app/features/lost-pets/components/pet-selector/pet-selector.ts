import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pet-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-selector.html',
  styleUrls: ['./pet-selector.scss']
})
export class PetSelector {
  @Input() myPets: any[] = [];
  @Output() onPetSelected = new EventEmitter<any>();
  @Output() onReportOtherPet = new EventEmitter<void>();

  selectedPetId: number | null = null;

  selectPet(pet: any): void {
    this.selectedPetId = pet.id;
    this.onPetSelected.emit(pet);
  }

  onReportOther(): void {
    this.onReportOtherPet.emit();
  }
}