import { Component } from '@angular/core';
// Importe de componentes hijos 
import { AccountInfoComponent } from '../../components/account-info/account-info'; 
import { MyPetsComponent } from '../../components/my-pets/my-pets'; 
import { MyUbicationsComponent } from '../../components/my-ubications/my-ubications'; 

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