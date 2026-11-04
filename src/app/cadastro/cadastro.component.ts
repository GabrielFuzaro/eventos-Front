import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  constructor(private authService: AuthService, private router: Router) {}

  mensagemErro: string = '';
  mensagemSucesso: string = '';
  enviando: boolean = false;

  cadastroFormulario = new FormGroup({
    // Mesmas regras da API (CadastroRequest)
    username: new FormControl<string>('', { nonNullable: true, validators: [
      Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9._-]+$/)
    ]}),
    senha: new FormControl<string>('', {nonNullable: true, validators: [
      Validators.required, Validators.minLength(8), Validators.maxLength(100)
    ]})
  })

  invalido(campo: string): boolean {
    const controle = this.cadastroFormulario.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  enviarCadastro() {
    const usuario = this.cadastroFormulario.getRawValue();

    this.mensagemErro = '';
    this.enviando = true;

    this.authService.cadatrar(usuario.username, usuario.senha)
    .subscribe({
      next: resposta => {
        this.cadastroFormulario.reset()
        this.mensagemSucesso = 'Conta criada com sucesso! Redirecionando para o login...';
        setTimeout(() => {
          this.irParaLogin();
        }, 1500);
      },
      error: erro => {
        this.enviando = false;
        // Erros de validação da API vêm em "campos"; mostra o primeiro, senão o título
        this.mensagemErro = erro.error?.campos?.[0]?.mensagem ?? erro.error?.titulo ?? 'Erro ao criar conta.';
        setTimeout(() => {
          this.mensagemErro = '';
        }, 3000);
      }
    })
  }

  irParaLogin(): void {
    this.router.navigate([
      './auth/login'
    ])
  }
}
