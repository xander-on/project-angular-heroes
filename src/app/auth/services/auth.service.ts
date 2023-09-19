import { Injectable }   from '@angular/core';
import { User }         from '../interfaces/user.interface';
import { environments } from 'src/environments/environments';
import { Observable, catchError, map, of, tap }   from 'rxjs';
import { HttpClient }   from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {

    private baseUrl = environments.baseUrl;
    private user?:User;

    constructor( private http:HttpClient ) { }

    get currentUser():User | undefined {
        return !this.user ? undefined : structuredClone(this.user)
    }


    login( email:string, password:string ):Observable<User> {
        return this.http.get<User>(`${ this.baseUrl }/users/1`)
        .pipe(
            tap( user => this.user = user ),
            tap( user => localStorage.setItem('token', user.id.toString() ))
        );
    }


    checkAuthentication():Observable<boolean>{
        const token = localStorage.getItem('token');

        return ( !token )
            ? of( false )
            : this.http.get<User>(`${ this.baseUrl }/users/1`).pipe(
                tap( user => this.user = user ),
                map( user => !!user ),
                catchError( err => of(false) )
            )
    }

    logout(){
        this.user = undefined;
        localStorage.clear();
    }
}
