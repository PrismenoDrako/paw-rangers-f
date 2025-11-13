import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-actions.html',
  styleUrls: ['./form-actions.scss']
})
export class FormActions {
  @Input() isFormValid: boolean = false;
  @Output() onSubmitForm = new EventEmitter<void>();
  @Output() onCancelForm = new EventEmitter<void>();

  onSubmit(): void {
    if (this.isFormValid) {
      this.onSubmitForm.emit();
    }
  }

  onCancel(): void {
    this.onCancelForm.emit();
  }
}