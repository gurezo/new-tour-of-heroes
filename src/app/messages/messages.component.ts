import { Component, OnInit } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { MessagesService } from '../messages.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [NgIf, NgFor],
})
export class MessagesComponent implements OnInit {
  constructor(public messagesService: MessagesService) {}

  ngOnInit(): void {}
}
