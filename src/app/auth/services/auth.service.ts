import { Injectable }   from '@angular/core';
import { User }         from '../interfaces/user.interface';
import { environments } from 'src/environments/environments';
import { Observable, catchError, map, of, tap }   from 'rxjs';
import { HttpClient }   from '@angular/common/http';
import { LoginData, SessionData } from '../interfaces/sessionData.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

    // private baseUrl = environments.baseUrl;
    private baseUrl = 'http://localhost:3000/heroes-api/v1';

    private user?:User;
    private sessionData?:SessionData | undefined;
    private nameItemLS:string = 'SESSION_DATA'

    constructor( private http:HttpClient ) {
        this.sessionData = this.currentSessionData;
    }


    get currentUser():User | undefined {
        return !this.user
            ? undefined
            : structuredClone(this.user);
    }


    get currentSessionData():SessionData | undefined {
        const sessionDataStr = localStorage.getItem(this.nameItemLS);
        if (!sessionDataStr) return undefined;

        this.sessionData = JSON.parse(sessionDataStr);

        //todo x
        console.log('sessionData:',this.sessionData)

        return !this.sessionData ? undefined : structuredClone(this.sessionData);
    }



    login( loginData:LoginData ):Observable<{ user:User, token:string }> {

        console.log(loginData);

        const body = {
            email:loginData.email,
            password: loginData.password
        };

        return this.http.post<{ user:User, token:string }>(
            `${ this.baseUrl }/auth/login`, body
        )
        .pipe(
            tap(
                response =>{
                    const {user, token} = response;
                    this.user = user;

                    this.sessionData = { userId:user.uid.toString(), token };
                    localStorage.setItem(this.nameItemLS, JSON.stringify(this.sessionData));
                }
            ),
        );
    }


    registerUser(user:User):Observable<User>{
        return this.http.post<User>(`${this.baseUrl}/users`, user );
    }


    checkAuthentication():Observable<boolean>{

        const userId = this.sessionData?.userId;

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
        this.sessionData = undefined;
        localStorage.clear();
    }
}
