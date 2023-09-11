import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/services/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {

    public sidebarItems = [
        { label: 'Listado', icon:'label',  url:'./list' },
        { label: 'Añadir',  icon:'add',    url:'./add-hero' },
        { label: 'Buscar',  icon:'search', url:'./search' },
    ];

    constructor(
        private authService:AuthService,
    ){}


    get user():User | undefined {
        console.log(this.authService.currentUser);
        return this.authService.currentUser;
    }
}
