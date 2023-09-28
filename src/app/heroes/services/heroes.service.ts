import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero, Publisher }         from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    // private baseUrl = environments.baseUrl;

    //todo remover
    private baseUrl = 'http://localhost:3000/heroes-api/v1';


    constructor( private http:HttpClient ) { }

    getHeroes():Observable<Hero[]>{
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
    }


    getHeroById( id:string ):Observable<Hero | undefined >{
        return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                catchError( error => of(undefined) )
            );
    }


    getSuggestions( query:string ):Observable<Hero[]>{
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes/?q=${query}&_limit=6`)
    }


    addHero( hero:Hero ):Observable<Hero> {
        return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero );
    }


    // updateHero( hero:Hero ):Observable<Hero> {
    //     if( !hero._id ) throw Error('Hero id is required');

    //     return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${hero._id}`, hero);
    // }

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

}
