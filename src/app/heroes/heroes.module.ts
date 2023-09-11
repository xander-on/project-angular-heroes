import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroesRoutingModule }  from './heroes-routing.module';
import { LayoutPageComponent }  from './pages/layout-page/layout-page.component';
import { AddHeroPageComponent } from './pages/add-hero-page/add-hero-page.component';
import { SearchPageComponent }  from './pages/search-page/search-page.component';
import { ListPageComponent }    from './pages/list-page/list-page.component';
import { HeroPageComponent }    from './pages/hero-page/hero-page.component';
import { MaterialModule }       from '../material/material.module';
import { CardComponent } from './components/card/card.component';
import { HeroImagePipe } from './pipes/hero-image.pipe';


@NgModule({
    declarations: [
        LayoutPageComponent,
        AddHeroPageComponent,
        SearchPageComponent,
        ListPageComponent,
        HeroPageComponent,
        CardComponent,
        HeroImagePipe
    ],
    imports: [
        CommonModule,
        HeroesRoutingModule,
        MaterialModule
    ]
})
export class HeroesModule { }
