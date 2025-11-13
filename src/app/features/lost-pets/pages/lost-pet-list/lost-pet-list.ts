import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar componentes personalizados
import { Search } from '../../components/search/search';
import { TitleButtom } from '../../components/title-buttom/title-buttom';
import { LostPets } from '../../components/lost-pets/lost-pets';

@Component({
  selector: 'app-lost-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    Search,
    TitleButtom,
    LostPets
  ],
  templateUrl: './lost-pet-list.html',
  styleUrls: ['./lost-pet-list.scss']
})
export class LostPetList implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  onSearch(searchTerm: string): void {
    console.log('Searching for:', searchTerm);
  }

  onFilterChange(filters: any): void {
    console.log('Filters changed:', filters);
  }
}