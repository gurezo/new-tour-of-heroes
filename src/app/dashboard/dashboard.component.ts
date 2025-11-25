import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, HeroSearchComponent]
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
