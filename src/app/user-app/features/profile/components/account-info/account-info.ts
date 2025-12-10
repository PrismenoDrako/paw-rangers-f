// account-info.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG 
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../../core/services/auth.service';


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
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        username: '',
        documento: '',
        email: '',
        phone: '',
        direccion: '',
        currentPassword: '',
        profileImage: null
    };

    user: any = {};
    profileImageUrl: string = '';

    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit(): void {
        const authUser = this.auth.user();
        const mappedUser = {
            nombre: authUser?.name ?? '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            username: authUser?.email?.split('@')[0] ?? '',
            documento: authUser?.documentId ?? '',
            email: authUser?.email ?? '',
            phone: authUser?.phone ?? '',
            direccion: authUser?.address ?? '',
            currentPassword: '',
            profileImage: authUser?.profileImage ?? null
        };

        AccountInfoComponent.sharedUser = { ...AccountInfoComponent.sharedUser, ...mappedUser };

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
        this.router.navigate(['/app/editar-perfil']);
    }
}
