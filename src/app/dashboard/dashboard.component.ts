import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        NgFor,
        RouterLink,
        HeroSearchComponent,
    ],
})
export class DashboardComponent implements OnInit {
  private destory = new Subject<void>();
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  ngOnDestroy(): void {
    this.destory.next();
    this.destory.complete();
  }

  getHeroes(): void {
    this.heroService
      .getHeroes()
      .pipe(takeUntil(this.destory))
      .subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }
}
