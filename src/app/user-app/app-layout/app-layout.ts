import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Navigation } from "../components/navigation/navigation";

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {

}
