import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login(): void{

    this.authService.login(this.username, this.password)
    .subscribe({
      next: token => {
        localStorage.setItem('token', token);
        console.log("Login Realizado");
        console.log("Token:", token);
      },
      error: erro => {
        console.error("Erro ao fazer login:", erro)
      }
    })
  }

}
