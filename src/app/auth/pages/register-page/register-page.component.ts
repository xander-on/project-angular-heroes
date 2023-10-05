import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-register-page',
  templateUrl: './register-page.component.html',
  styles: [
  ]
})
export class RegisterPageComponent implements OnInit{

    public userToRegister?:User;

    public userForm = new FormGroup({
        name     : new FormControl<string>('', { nonNullable:true }),
        email    : new FormControl<string>(''),
        password : new FormControl<string>(''),
    });

    public errors:[] = [];

    constructor(
        private authService:AuthService,
        private snackbar:MatSnackBar,
        private router:Router,
    ){}


    ngOnInit(): void {

    }


    get currentUser():User{
        return this.userForm.value as User;
    }

    get disabledActionButton():boolean {
        return this.userForm.invalid;
    }

    showSnackbar( message:string ):void {
        this.snackbar.open( message, 'done', {
            duration:2500
        });
    }


    onRegisterUser():void{

        this.userToRegister = this.currentUser;
        console.log(this.userToRegister)

        if(this.userForm.valid){
            this.authService.registerUser(this.userToRegister)
            .subscribe(
                user => {
                    // redireccionar a login

                    this.showSnackbar(`${user.name} CREATED`);
                    setTimeout(() => {
                        this.router.navigate(['auth/login']);
                    }, 2000);
                },

                (errors:any) => { this.errors = errors }
            );
        }
    }
}
