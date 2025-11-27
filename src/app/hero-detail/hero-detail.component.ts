import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private heroService = inject(HeroService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  private destory = new Subject<void>();
  hero = signal<Hero | undefined>(undefined);

  ngOnDestroy(): void {
    this.destory.next();
    this.destory.complete();
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService
      .getHero(id)
      .pipe(takeUntil(this.destory))
      .subscribe((hero) => {
        this.hero.set(hero);
        this.cdr.detectChanges();
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    const hero = this.hero();
    if (hero) {
      this.heroService
        .updateHero(hero)
        .pipe(takeUntil(this.destory))
        .subscribe(() => this.goBack());
    }
  }
}
