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

  enviando: boolean = false;
  mostrarSenha: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void{

    this.mensagemErro = '';
    this.enviando = true;

    this.authService.login(this.username, this.password)
    .subscribe({
      next: token => {
        sessionStorage.setItem('token', token);
        this.mensagemSucesso = 'Login realizado com sucesso! Redirecionando...'
        setTimeout(() => {
          this.router.navigate([
            './eventos'
          ])
        }, 1000);
      },
      error: erro => {
        console.error("Erro ao fazer login:", erro)
        this.enviando = false;
        this.mensagemErro = erro.status === 0
          ? 'Não foi possível conectar ao servidor.'
          : 'Usuário ou senha inválidos.'
        setTimeout(() => {
          this.mensagemErro = ''
        }, 3000);
      }
    })
  }

  irParaCadastro(){
    this.router.navigate([
      './auth/cadastro'
    ]);
  }

}
