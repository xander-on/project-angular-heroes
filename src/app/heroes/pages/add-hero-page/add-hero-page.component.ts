import { Component, OnInit }      from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher, namePublisher }        from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, filter, switchMap }  from 'rxjs';
import { HeroesService }          from '../../services/heroes.service';
import { MatSnackBar }            from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-add-hero-page',
    templateUrl: './add-hero-page.component.html',
    styles: [
    ]
})
export class AddHeroPageComponent implements OnInit{

    public heroForm = new FormGroup({
        _id        : new FormControl<string>(''),
        superhero : new FormControl<string>('', { nonNullable:true }),
        publisher : new FormControl<Publisher>( {
            _id:  '',
            name: namePublisher.DCComics,
            state: true
        } ),
        alter_ego       : new FormControl(''),
        first_appearance: new FormControl(''),
        characters      : new FormControl(''),
        alt_img         : new FormControl(''),
    });


    public publishers:Publisher[] = [];

    private service?:Observable<Hero>;
    private heroInicial?:Hero;

    constructor(
        private heroesService:HeroesService,
        private router:Router,
        private activatedRoute:ActivatedRoute,
        private snackbar:MatSnackBar,
        private dialog:MatDialog,
    ){}


    ngOnInit():void {

        this.heroesService.getPublishers().subscribe(
            publishers => {
                this.publishers = publishers
            }
        );

        if( !this.router.url.includes('edit') ) return;

        this.activatedRoute.params.pipe(
            switchMap( ({id}) => this.heroesService.getHeroById( id ))
        ).subscribe(
            hero => {
                if( !hero ) return this.router.navigateByUrl('/');

                this.heroInicial = hero;
                this.heroForm.reset( hero );
                return;
            }
        );

    }


    get currentHero():Hero {
        return this.heroForm.value as Hero;
    }


    get enabledSaveButton():boolean {
        return (!this.heroForm.dirty)
    }


    onSubmit():void {

        if( this.heroForm.invalid ) return;


        this.service = ( this.currentHero._id )
            ? this.heroesService.updateHero( this.currentHero )
            : this.heroesService.addHero( this.currentHero )

            this.service.subscribe( hero => {
                this.router.navigate(['heroes/edit', hero._id]);
                this.showSnackbar(`${hero.superhero} ${this.currentHero._id ?'UPDATED' : 'CREATED' }`)
            });
    }



    onDeleteHero(){
        if( !this.currentHero._id ) throw Error('Hero id is Required');

        const dialogRef = this.dialog.open( ConfirmDialogComponent, {
            data: this.heroForm.value
        });

        dialogRef.afterClosed()
        .pipe(
            filter( (result:boolean) => result ),
            switchMap( () => this.heroesService.deleteHeroById(this.currentHero._id) ),
            filter( (wasDelete:boolean) => wasDelete )
        )
        .subscribe( () => {
            this.router.navigate(['/heroes']);
        });
    }


    showSnackbar( message:string ):void {
        this.snackbar.open( message, 'done', {
            duration:2500
        });
    }
}
