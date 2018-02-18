import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Router } from '@angular/router';

import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs/Subscription';

import { ChatMessage } from '../model/chat-message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private static ROOM_TOPIC: string = '/topic/rooms/general';

  public nickName: string;
  public message: string;

  private subscription: Subscription;
  private messages: Observable<Message>;
  private messageHistory: ChatMessage[] = [];

  constructor(private router: Router, private stompService: StompService) { }

  ngOnInit() {
  	if (!window.localStorage.getItem('nick')) {
		this.backToLogin();
  	} else {
  		this.nickName = window.localStorage.getItem('nick');
  		this.initializeWebSocket();
  	}

  	if (!!window.localStorage.getItem('messageHistory')) {
  		this.messageHistory = JSON.parse(window.localStorage.getItem('messageHistory'));
  	}
  }

  public say(): void {
	this.stompService.publish(RoomComponent.ROOM_TOPIC, JSON.stringify(new ChatMessage(this.nickName, this.message, new Date())));
	this.message = '';
  }

  private backToLogin(): void {
    this.router.navigate(['/login']);
  }

  private initializeWebSocket(): void {
	this.messages = this.stompService.subscribe(RoomComponent.ROOM_TOPIC);

	this.subscription = this.messages.subscribe(this.onChatMessage);
  }

  private onChatMessage = (message: Message) => {
  	let chatMessage: ChatMessage = <ChatMessage>JSON.parse(message.body);
  	chatMessage.timeReceived = new Date();
  	this.messageHistory.push(chatMessage);
  	window.localStorage.setItem('messageHistory', JSON.stringify(this.messageHistory));
  }

}
