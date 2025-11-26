import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MessagesComponent {
  messagesService = inject(MessagesService);

  messages$ = this.messagesService.messages$;
}
