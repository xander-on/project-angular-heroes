import { inject } from '@angular/core';
import {
    CanActivateFn,
    CanMatchFn,
    Router,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService }     from '../services/auth.service';

const checkAuthStatus = ():boolean | Observable<boolean> => {
    //se inyectan el AuthService y el Router
    const authService:AuthService = inject(AuthService);
    const router:Router = inject(Router);

    return authService.checkAuthentication().pipe(
        tap((isAuthenticated) => {
            if (!isAuthenticated) router.navigate(['/auth/login']);
        })
    );
};

export const authCanActivate:CanActivateFn = () => checkAuthStatus();

export const authCanMatch:CanMatchFn = () => checkAuthStatus();
