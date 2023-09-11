import { Injectable } from '@angular/core';
import { User } from './interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

    private user?:User;

    constructor() { }


    get currentUser():User | undefined {
        return !this.user ? undefined : structuredClone(this.user)
    }
}
