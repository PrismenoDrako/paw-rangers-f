import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLayout {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() illustrationSrc = 'assets/img/fondologin.png';
}
