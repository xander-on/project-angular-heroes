

export interface User {
    uid:number;
    name:string;
    email:string;
    role:string;
    alt_img:string;
    state:boolean;
    // user:string;
}


export interface UserRegister {
    name:string;
    email:string;
    password:string;
}
