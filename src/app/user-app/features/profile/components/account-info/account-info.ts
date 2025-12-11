// account-info.ts
import { Component, OnInit } from '@angular/core';
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

    profileImageUrl: string = '';

    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit(): void {
        console.log('AccountInfoComponent ngOnInit');
    }

    /**
     * Getter para acceder a los datos del usuario desde el auth service
     * Mapea los datos del usuario autenticado al formato esperado por el template
     */
    get user(): any {
        const authUser = this.auth.user();
        console.log('AccountInfoComponent get user() - authUser:', authUser);
        
        return {
            nombre: authUser?.name ?? '',
            apellidoPaterno: authUser?.apellidoPaterno ?? '',
            apellidoMaterno: authUser?.apellidoMaterno ?? '',
            username: authUser?.email?.split('@')[0] ?? '',
            documento: authUser?.documentId ?? '',
            email: authUser?.email ?? '',
            phone: authUser?.phone ?? '',
            direccion: authUser?.address ?? '',
            profileImage: authUser?.profileImage ?? null
        };
    }

    /**
     * Getter para la imagen de perfil
     */
    get profileImage(): string {
        const authUser = this.auth.user();
        return authUser?.profileImage || '';
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
