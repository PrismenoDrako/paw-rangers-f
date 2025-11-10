import { Component } from '@angular/core';
import { LostPetCard } from "../../components/lost-pet-card/lost-pet-card";

@Component({
  selector: 'app-lost-pet-list',
  imports: [LostPetCard],
  templateUrl: './lost-pet-list.html',
  styleUrl: './lost-pet-list.scss',
})
export class LostPetList {

  items = [ 1,2,3,4,5,6,7 ];

}
