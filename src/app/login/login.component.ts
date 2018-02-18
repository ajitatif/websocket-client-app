import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public nickName: string;

  constructor(private router: Router) { }

  ngOnInit() {
  	if (!!window.localStorage.getItem('nick')) {
  		this.proceed();
  	}
  }

  public doLogin(): void {
  	window.localStorage.setItem('nick', this.nickName);
  	this.proceed();
  }

  private proceed(): void {
  	this.router.navigate(['/room']);
  }

}
