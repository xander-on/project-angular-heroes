import { Injectable }   from '@angular/core';
import { User }         from '../interfaces/user.interface';
import { environments } from 'src/environments/environments';
import { Observable, catchError, map, of, tap }   from 'rxjs';
import { HttpClient }   from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {

    // private baseUrl = environments.baseUrl;
    private baseUrl = 'http://localhost:3000/heroes-api/v1';

    private user?:User;

    constructor( private http:HttpClient ) { }

    get currentUser():User | undefined {
        return !this.user ? undefined : structuredClone(this.user)
    }


    // login( email:string, password:string ):Observable<User> {
    //     return this.http.get<User>(`${ this.baseUrl }/users/1`)
    //     .pipe(
    //         tap( user => this.user = user ),
    //         tap( user => localStorage.setItem('token', user.id.toString() ))
    //     );
    // }

    login( email:string, password:string ):Observable<{ user:User, token:string }> {
        const body = { email, password };
        return this.http.post<{ user:User, token:string }>(
            `${ this.baseUrl }/auth/login`, body
        )
        .pipe(
            tap(
                response =>{
                    const {user, token} = response;

                    this.user = user;

                    const userSession = {
                        user:user.uid,
                        token
                    };

                    localStorage.setItem('DATA_SESSION', JSON.stringify(userSession));

                }
            ),
        );
    }


    checkAuthentication():Observable<boolean>{
        let dataSession, userId, token;
        const userSessionStr = localStorage.getItem('DATA_SESSION');

        if (userSessionStr){
            dataSession = JSON.parse(userSessionStr);
            userId = dataSession.user;
            token  = dataSession.token;
        }

        return ( !userId )
            ? of( false )
            : this.http.get<User>(`${ this.baseUrl }/users/${userId}`).pipe(
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
