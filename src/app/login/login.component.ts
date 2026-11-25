import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  loginFormulario = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  mensagemErro = '';
  mensagemSucesso = '';

  enviando = false;
  mostrarSenha = false;
  private timerMensagem?: ReturnType<typeof setTimeout>;
  private timerRedirecionamento?: ReturnType<typeof setTimeout>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    clearTimeout(this.timerMensagem);
    clearTimeout(this.timerRedirecionamento);
  }

  invalido(campo: 'username' | 'password'): boolean {
    const controle = this.loginFormulario.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  login(): void {
    if (this.loginFormulario.invalid) {
      this.loginFormulario.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginFormulario.getRawValue();
    clearTimeout(this.timerMensagem);
    this.mensagemErro = '';
    this.enviando = true;

    this.authService.login(username, password)
      .subscribe({
        next: () => {
          // O token chega num cookie HttpOnly gravado pelo navegador; não é guardado no JavaScript
          this.mensagemSucesso = 'Login realizado. Redirecionando...';
          this.timerRedirecionamento = setTimeout(() => {
            this.router.navigate(['./eventos']);
          }, 1000);
        },
        error: erro => {
          this.enviando = false;
          this.loginFormulario.controls.password.reset(''); // Não deixa a senha errada no campo
          this.mensagemErro = erro.status === 0
            ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
            : erro.error?.titulo ?? 'Usuário ou senha inválidos.';
          this.timerMensagem = setTimeout(() => {
            this.mensagemErro = '';
          }, 3500);
        }
      });
  }
}
