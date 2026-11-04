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
      next: () => {
        // O token chega num cookie HttpOnly gravado pelo navegador; não é guardado no JavaScript
        this.mensagemSucesso = 'Login realizado com sucesso! Redirecionando...'
        setTimeout(() => {
          this.router.navigate([
            './eventos'
          ])
        }, 1000);
      },
      error: erro => {
        this.enviando = false;
        this.password = ''; // Não deixa a senha errada no campo
        this.mensagemErro = erro.status === 0
          ? 'Não foi possível conectar ao servidor.'
          : erro.error?.titulo ?? 'Usuário ou senha inválidos.' // Inclui o aviso de bloqueio por muitas tentativas
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
