import { Component }   from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router }      from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginData } from '../../interfaces/sessionData.interface';

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
        this.loginData = this.currentLogin;

        if(this.loginData){
            this.authService.login(this.loginData)
            .subscribe(
                response => { this.router.navigate(['/']) }
            );
        }
    }
}
