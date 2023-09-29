import { Component, OnInit }      from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog }              from '@angular/material/dialog';
import { Hero, Publisher, namePublisher } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, filter, switchMap }  from 'rxjs';
import { HeroesService }          from '../../services/heroes.service';
import { MatSnackBar }            from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-add-hero-page',
    templateUrl: './add-hero-page.component.html',
    styles: [
    ]
})
export class AddHeroPageComponent implements OnInit{

    public heroForm = new FormGroup({
        _id       : new FormControl<string>(''),
        superhero : new FormControl<string>('', { nonNullable:true }),
        alter_ego : new FormControl(''),
        publisher : new FormControl<Publisher>( {
            _id:  '',
            name: namePublisher.DCComics,
            state: true
        } ),
        first_appearance: new FormControl(''),
        characters      : new FormControl(''),
        alt_img         : new FormControl(''),
    });


    public publishers:Publisher[] = [];
    private service?:Observable<Hero>;
    public tempImage?:File;
    public tempImageUrl:string='';

    //no se usa porq se usa el dirty para ver si se mod el form
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
            publishers => { this.publishers = publishers }
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


    get disabledActionButtons():boolean {
        const hero = {...this.heroInicial};
        delete hero.state;
        delete hero.created_by;
        return this.areObjectsEqual(this.currentHero, hero);
    }


    onCancel():void {
        this.heroForm.reset( this.heroInicial );
        this.tempImage = undefined;
    }


    onSubmit():void {

        if( this.heroForm.invalid ) return;

        this.service = ( this.currentHero._id )
            ? this.heroesService.updateHero( this.currentHero )
            : this.heroesService.addHero( this.currentHero );


        this.service.subscribe( hero => {
            this.showSnackbar(`${hero.superhero} ${this.currentHero._id ?'UPDATED' : 'CREATED' }`);

            //todo !
            this.heroesService.uploadImage(this.tempImage!, hero._id)
            .subscribe( (response) => {
                this.router.navigate(['heroes/', hero._id]);
            });
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


    onFileSelected(event:any):void {
        const selectedFile = event.target.files[0];
        if(selectedFile) {
            this.tempImage    = selectedFile;
            this.tempImageUrl = URL.createObjectURL(selectedFile);
            this.currentHero.alt_img = this.tempImageUrl;

            // console.log(this.tempImageUrl);
        }
    }



    areObjectsEqual(objA:any, objB:any):boolean {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
          if (objA[key] !== objB[key]) return false;
        }

        return true;
    }
}
