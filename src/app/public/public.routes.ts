import { Routes } from "@angular/router";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { guestGuard } from "../core/guards/guest.guard";

export const PublicRoutes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'auth',
        canMatch: [guestGuard],
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    }
];
