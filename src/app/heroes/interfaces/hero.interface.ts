// export interface Hero {
//     id:               string;
//     superhero:        string;
//     publisher:        Publisher;
//     alter_ego:        string;
//     first_appearance: string;
//     characters:       string;
//     alt_img?:         string;
// }


export interface Hero {
    _id       :       string;
    superhero:        string;
    publisher:        Publisher;
    alter_ego:        string;
    first_appearance: string;
    characters :      string;
    alt_img?   :      string;
    created_by :      CreatedBy;
    state      :      boolean;
}

export enum namePublisher {
    DCComics     = "DC Comics",
    MarvelComics = "Marvel Comics",
}

export interface Publisher {
    _id:  string;
    name: namePublisher;
    state: boolean;
}


export interface CreatedBy {
    _id:  string;
    name: string;
}
