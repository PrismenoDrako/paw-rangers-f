import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories {
  @Input() selectedCategory: string = 'Todos';
  @Output() onCategoryChange = new EventEmitter<string>();

  categories = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Perros', value: 'Perros' },
    { label: 'Gatos', value: 'Gatos' },
    { label: 'Recientes', value: 'Recientes' },
    { label: 'Con Recompensa', value: 'Con Recompensa' }
  ];

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.onCategoryChange.emit(category);
  }
}
