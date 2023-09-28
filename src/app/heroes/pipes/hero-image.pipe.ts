import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Hero } from '../interfaces/hero.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

    constructor(
        private sanitizer:DomSanitizer,
        private http: HttpClient
    ) {}

    transform( hero:Hero ):SafeResourceUrl {

        if (!hero._id && !hero.alt_img) {
            return this.sanitizer.bypassSecurityTrustResourceUrl('assets/no-image.png');
        }

        if ( hero.alt_img || hero.alt_img === "" ) {
            return this.isValidUrl(hero.alt_img)
                ?(hero.alt_img)
                :(this.sanitizer.bypassSecurityTrustResourceUrl('assets/no-image.png'));
        }

        return this.sanitizer.bypassSecurityTrustResourceUrl('assets/no-image.png');
    }


    private isValidUrl( url:string ):boolean {
        const urlPattern = /^(https?:\/\/)/i;
        const validExtension = ['jpg', 'png', 'jpeg'];
        const extension = this.getFileExtension(url)
        return urlPattern.test(url)
            && extension !== undefined
            && validExtension.includes(extension);
    }

    private getFileExtension(filename: string): string | undefined {
        const dotIndex = filename.lastIndexOf('.');
        return (dotIndex === -1)
            ? undefined
            : filename.slice(dotIndex + 1);
    }

}
