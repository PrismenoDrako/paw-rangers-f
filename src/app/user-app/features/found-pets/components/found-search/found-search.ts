import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchFilters {
  query: string;
  category: string;
  hasCollar: boolean;
  recentOnly: boolean;
}

@Component({
  selector: 'app-found-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './found-search.html',
  styleUrls: ['./found-search.scss']
})
export class FoundSearch {
  @Output() onFiltersUpdate = new EventEmitter<SearchFilters>();

  searchQuery: string = '';
  selectedCategory: string = 'todos';
  showFilters: boolean = false;
  
  filters: SearchFilters = {
    query: '',
    category: 'todos',
    hasCollar: false,
    recentOnly: false
  };
  
  categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'perros', name: 'Perros' },
    { id: 'gatos', name: 'Gatos' },
    { id: 'con-collar', name: 'Con collar' },
    { id: 'recientes', name: 'Recientes' }
  ];

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearchChange(): void {
    this.filters.query = this.searchQuery;
    this.emitFilters();
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filters.category = categoryId;
    this.emitFilters();
  }

  onFiltersChange(): void {
    this.emitFilters();
  }

  private emitFilters(): void {
    this.onFiltersUpdate.emit(this.filters);
  }
}