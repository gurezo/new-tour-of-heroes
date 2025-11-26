import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
  @Input() hero?: Hero;

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
        this.hero = hero;
        this.cdr.detectChanges();
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService
        .updateHero(this.hero)
        .pipe(takeUntil(this.destory))
        .subscribe(() => this.goBack());
    }
  }
}
