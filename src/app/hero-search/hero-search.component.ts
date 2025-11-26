import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class HeroSearchComponent implements OnInit {
  private heroService = inject(HeroService);

  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  // 検索語をobservableストリームにpushする
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // 各キーストロークの後、検索前に300ms待つ
      debounceTime(300),

      // 直前の検索語と同じ場合は無視する
      distinctUntilChanged(),

      // 検索語が変わる度に、新しい検索observableにスイッチする
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
