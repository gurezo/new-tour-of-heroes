import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Hero } from '../hero';

import { HeroService } from '../hero.service';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink],
})
export class HeroesComponent implements OnInit, OnDestroy {
  private destory = new Subject<void>();
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHoroes();
  }

  ngOnDestroy(): void {
    this.destory.next();
    this.destory.complete();
  }

  getHoroes() {
    this.heroService
      .getHeroes()
      .pipe(takeUntil(this.destory))
      .subscribe((hero) => (this.heroes = hero));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({ name } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
