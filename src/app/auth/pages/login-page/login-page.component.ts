import { Component }   from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router }      from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginData } from '../../interfaces/sessionData.interface';
import { catchError } from 'rxjs';

@Component({
  selector: 'auth-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {

    public loginForm = new FormGroup({
        email    : new FormControl<string>('', { nonNullable:true }),
        password : new FormControl<string>('', { nonNullable:true }),
    });

    private loginData?:LoginData;
    public errors:[] = [];
    public isGuest:boolean = false;

    constructor(
        private authService:AuthService,
        private router:Router
    ){}


    get currentLogin(){
        return this.loginForm.value as LoginData;
    }

    get disabledActionButton():boolean{
        return this.loginForm.invalid;
    }


    onLogin():void {

        const guestData = { email:'invitado@test.com', password:'123456'};

        this.loginData = this.isGuest ? guestData : this.currentLogin;

        if(this.loginData){
            this.authService.login(this.loginData)
            .subscribe(
                response => {
                    // console.log(response);
                    this.router.navigate(['/'])
                },

                (errors:any) => { this.errors = errors }
            );
        }
    }


    loginGuest():void{
        this.isGuest = true;
        this.onLogin();
    }
}
