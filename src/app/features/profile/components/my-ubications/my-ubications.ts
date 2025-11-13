import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-my-ubications',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './my-ubications.html',
  styleUrl: './my-ubications.scss'
})
export class MyUbicationsComponent {
  constructor() { }
}
