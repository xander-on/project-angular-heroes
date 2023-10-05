import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero, Publisher, GetHeroesType }  from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseUrl = environments.baseUrl;

    constructor(
        private http:HttpClient,
        private authService: AuthService
    ) {}


    getHeroes(limit:number = 12, offset:number = 0):Observable<GetHeroesType>{
        return this.http.get<GetHeroesType>(`${this.baseUrl}/heroes?limit=${limit}&offset=${offset}`);
    }


    getHeroById( id:string ):Observable<Hero | undefined >{
        return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                catchError( error => of(undefined) )
            );
    }


    getSuggestions( identificador:string ):Observable<Hero[]>{
        return this.http.get<Hero[]>(`${this.baseUrl}/searchs/heroes/${identificador}`)
    }


    addHero( hero:Hero ):Observable<Hero> {

        const sessionData = this.authService.currentSessionData;
        const token = sessionData?.token;

        if( !token ) throw new Error('no hay token...');

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-token': token
          });

        return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero, { headers } );
    }


    updateHero( hero:Hero ):Observable<Hero> {
        if( !hero._id ) throw Error('Hero id is required');

        return this.http.put<Hero>(`${ this.baseUrl }/heroes/${hero._id}`, hero);
    }


    deleteHeroById( id:string ):Observable<boolean>{
        return this.http.delete(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                map( resp => true ),
                catchError( err => of(false) )
            );
    }



    //publisher
    getPublishers():Observable<Publisher[]>{
        return this.http.get<Publisher[]>(`${this.baseUrl}/publishers`);
    }


    //subir imagen
    uploadImage( file:File, hero_id:string ):Observable<any> {
        const formData = new FormData();
        formData.append('archivo', file);

        return this.http.put(`${this.baseUrl}/uploads/heroes/${hero_id}`, formData);
    }


    isCreatorUser(hero:Hero):boolean{
        const userIdCreatorHero = hero?.created_by._id;
        const userIdSession     = this.authService.currentSessionData?.userId
        return userIdCreatorHero === userIdSession;
    }
}
