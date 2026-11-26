import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginFormulario = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  enviando = false;
  mostrarSenha = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifier: NotifierService
  ) {}

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
    this.enviando = true;

    this.authService.login(username, password)
      .subscribe({
        next: () => {
          // O token chega num cookie HttpOnly gravado pelo navegador; o toast global permanece visível na tela destino
          this.notifier.sucesso('Acesso realizado');
          this.router.navigate(['/eventos']);
        },
        error: erro => {
          this.enviando = false;
          this.loginFormulario.controls.password.reset('');
          const mensagem = erro.status === 0
            ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
            : erro.error?.titulo ?? 'Usuário ou senha inválidos.';
          this.notifier.erro(mensagem);
        }
      });
  }
}
