import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private heroService = inject(HeroService);
  private cdr = inject(ChangeDetectorRef);

  private destory = new Subject<void>();
  heroes: Hero[] = [];

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
