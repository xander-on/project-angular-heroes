import { Component, OnInit } from '@angular/core';
import { HeroesService }     from '../../services/heroes.service';
import { Hero }              from '../../interfaces/hero.interface';
import { PageEvent }         from '@angular/material/paginator';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit{

    public heroes:Hero[] = [];
    public totalHeroes:number = 0;
    public pageSize:number    = 12;
    public currentPage:number = 1;
    public from:number        = 0;

    constructor(
        private heroesService:HeroesService,
    ){}

    ngOnInit():void {
        this.heroesService.getHeroes().subscribe(
            response => {
                this.heroes      = response.results,
                this.totalHeroes = response.total
            }
        );
    }

    onPageChange(event:PageEvent):void {
        this.currentPage = event.pageIndex + 1;
        this.pageSize    = event.pageSize;
        this.from        = (this.currentPage-1) * this.pageSize;

        this.heroesService.getHeroes(this.pageSize, this.from)
        .subscribe(
            response => {
                this.heroes      = response.results,
                this.totalHeroes = response.total
            }
        );
    }
}
