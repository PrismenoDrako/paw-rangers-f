import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PetInfo {
  name: string;
  type: string;
  breed: string;
}

@Component({
  selector: 'app-pet-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-info-form.html',
  styleUrls: ['./pet-info-form.scss']
})
export class PetInfoForm implements OnInit {
  @Input() selectedPet: any = null;
  @Output() onInfoChange = new EventEmitter<PetInfo>();

  petInfo: PetInfo = {
    name: '',
    type: '',
    breed: ''
  };

  ngOnInit(): void {
    if (this.selectedPet) {
      this.petInfo = {
        name: this.selectedPet.name || '',
        type: this.selectedPet.type || '',
        breed: this.selectedPet.breed || ''
      };
      this.onFormChange();
    }
  }

  onFormChange(): void {
    this.onInfoChange.emit(this.petInfo);
  }
}