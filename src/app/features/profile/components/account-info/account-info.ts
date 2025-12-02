// account-info.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG 
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';


@Component({
    selector: 'app-account-info',
    standalone: true,
    imports: [
        CommonModule,
        AvatarModule,
        ButtonModule,
        CardModule
    ],
    templateUrl: './account-info.html',
    styleUrl: './account-info.scss'
})
export class AccountInfoComponent implements OnInit {

    // Datos compartidos que pueden ser actualizados desde account-form
    static sharedUser: any = {
        nombre: 'Daniel',
        apellidoPaterno: 'Vega Bazán',
        apellidoMaterno: 'Llontop',
        username: 'danielvegabazan',
        documento: '12345678',
        email: 'danielino@gmail.com',
        phone: '+51 927 165 937',
        direccion: 'Urb Lourdes Mz A Dto 101',
        currentPassword: 'Daniel123_',
        profileImage: null
    };

    user: any = {};
    profileImageUrl: string = '';

    constructor(private router: Router) { }

    ngOnInit(): void {
        // Obtener los datos del usuario compartidos
        this.user = AccountInfoComponent.sharedUser;
        // Obtener la imagen de perfil si existe
        this.profileImageUrl = this.user.profileImage || '';
    }

    /**
     * Navega a la página de edición del perfil cuando se hace clic en el botón.
     */
    onEditProfile(): void {
        console.log('Navegando a la página de edición de perfil...');
        //Ruta a la pagina de editar perfil
        this.router.navigate(['/editar-perfil']);
    }
}