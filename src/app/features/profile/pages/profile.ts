import { Component } from '@angular/core';
import { AccountInfoComponent } from '../components/account-info/account-info'; // Importa el componente AccountInfoComponent
import { MyPetsComponent } from '../components/my-pets/my-pets'; // Importa el componente MyPetsComponent
import { MyUbicationsComponent } from '../components/my-ubications/my-ubications'; // Importa el componente MyUbicationsComponent

@Component({
  selector: 'app-profile',
  standalone: true, 
  imports: [
    AccountInfoComponent,
    MyPetsComponent,
    MyUbicationsComponent 
  ], 
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

}
