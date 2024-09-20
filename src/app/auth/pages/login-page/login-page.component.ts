import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})


export class LoginPageComponent {

  public hide: boolean = true;


  constructor(
    private authService : AuthService,
    private router: Router
  ){}

  onLogin():void {
      this.authService.login('jissy@gmail.com','12345')
      .subscribe( user => {
        console.log(user)
        this.router.navigate(['/'])
      });
  }
}
