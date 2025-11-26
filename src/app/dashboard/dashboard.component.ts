import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Hero } from '../hero';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterModule, HeroSearchComponent],
})
export class DashboardComponent implements OnInit {
  private destory = new Subject<void>();
  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    private cdr: ChangeDetectorRef
  ) {}

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
      .subscribe((heroes) => {
        this.heroes = heroes.slice(1, 5);
        this.cdr.detectChanges();
      });
  }
}
