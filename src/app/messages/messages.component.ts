import { Component, OnInit } from '@angular/core';

import { MessagesService } from '../messages.service';
import { NgIf, NgFor } from '@angular/common';
@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor],
})
export class MessagesComponent implements OnInit {
  constructor(public messagesService: MessagesService) {}

  ngOnInit(): void {}
}
