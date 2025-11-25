import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterModule, MessagesComponent]
})
export class AppComponent {
  title = 'TourOfHeroes';
}
