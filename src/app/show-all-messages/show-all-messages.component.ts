import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-show-all-messages',
  templateUrl: './show-all-messages.component.html',
  styleUrls: ['./show-all-messages.component.css']
})
export class ShowAllMessagesComponent implements OnInit {
  @Input()
  private messages: [any];
  @Input()
  private submitClicked: boolean;

  constructor() { }

  ngOnInit() {
  }

  shouldShowErrors(): boolean {
    return (this.messages !== null && this.submitClicked);
  }

}
