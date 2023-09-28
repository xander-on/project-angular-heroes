import {
    CanActivateFn,
    CanMatchFn,
    Router,
} from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject }      from "@angular/core";


const checkAuthStatus = ():boolean | Observable<boolean> => {

    const authService:AuthService = inject(AuthService);
    const router:Router = inject(Router);

    return authService.checkAuthentication()
    .pipe(
        tap( isAuthenticated => console.log('Authenticated:', isAuthenticated)),
        tap( isAuthenticated => {
            if( isAuthenticated ) router.navigate(['./'])
        }),
        map( isAuthenticated => !isAuthenticated ),
    )
}


export const publicCanActivate:CanActivateFn = () => checkAuthStatus();


export const publicCanMatch:CanMatchFn = () => checkAuthStatus();

