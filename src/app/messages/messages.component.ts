import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesService } from '../messages.service';
@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class MessagesComponent implements OnInit {
  constructor(public messagesService: MessagesService) {}

  ngOnInit(): void {}
}
