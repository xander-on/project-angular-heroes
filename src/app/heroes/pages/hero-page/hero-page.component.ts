import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit{

    public hero?:Hero;

    constructor(
        private heroesService:HeroesService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
    ){}

    ngOnInit():void {
        this.activatedRoute.params.pipe(
            switchMap(({ id }) => this.heroesService.getHeroById( id )),
        )
        .subscribe( hero =>{
            console.log(hero)
            return hero
                ? this.hero = hero
                : this.router.navigate(['/heroes/list']);
        });
    }

    goBack():void{
        this.router.navigateByUrl('heroes/list');
    }

    get disabledEdit():boolean {
        if(!this.hero) false;
        return this.heroesService.isCreatorUser(this.hero!);
    }

}
