import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DescriptionFormData {
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  hasReward: boolean;
  rewardAmount?: number;
}

@Component({
  selector: 'app-description-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './description-form.html',
  styleUrls: ['./description-form.scss']
})
export class DescriptionForm {
  @Output() onFormDataChange = new EventEmitter<DescriptionFormData>();

  formData: DescriptionFormData = {
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    hasReward: false
  };

  onFormChange(): void {
    this.onFormDataChange.emit(this.formData);
  }
}