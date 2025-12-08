import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBox } from '../search-box/search-box';
import { Categories } from '../categories/categories';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchBox, Categories],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class Search {
  @Input() selectedCategory: string = 'Todos';
  @Output() onSearch = new EventEmitter<string>();
  @Output() onCategoryChange = new EventEmitter<string>();

  handleSearch(searchTerm: string): void {
    this.onSearch.emit(searchTerm);
  }

  handleCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.onCategoryChange.emit(category);
  }
}
