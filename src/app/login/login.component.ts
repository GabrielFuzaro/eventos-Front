import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  mensagemErro: string = '';
  mensagemSucesso: string = '';


  constructor(private authService: AuthService, private router: Router) {}

  login(): void{

    this.authService.login(this.username, this.password)
    .subscribe({
      next: token => {
        sessionStorage.setItem('token', token);
        console.log("Login Realizado");
        this.mensagemSucesso = 'Login realizado com Sucesso! Aguarde...'
        setTimeout(() => {
          this.router.navigate([
            './eventos'
          ])
        }, 2000);
      },
      error: erro => {
        console.error("Erro ao fazer login:", erro)
        this.mensagemErro = 'Usuário ou senha inválidos.'
      }
    })
  }

  irParaCadastro(){
    this.router.navigate([
      './auth/cadastro'
    ]);
  }

}
