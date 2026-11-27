import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifier: NotifierService
  ) {}

  enviando = false;
  mostrarSenha = false;

  cadastroFormulario = new FormGroup({
    // Mesmas regras da API (CadastroRequest)
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]
    }),
    senha: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]
    })
  });

  invalido(campo: string): boolean {
    const controle = this.cadastroFormulario.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  enviarCadastro(): void {
    if (this.cadastroFormulario.invalid) {
      this.cadastroFormulario.markAllAsTouched();
      return;
    }

    const usuario = this.cadastroFormulario.getRawValue();
    this.enviando = true;

    this.authService.cadastrar(usuario.username, usuario.senha)
      .subscribe({
        next: () => {
          this.cadastroFormulario.reset();
          this.notifier.sucesso('Conta criada com sucesso');
          this.irParaLogin();
        },
        error: erro => {
          this.enviando = false;
          this.notifier.erroApi(erro, 'Não foi possível criar a conta. Tente novamente.');
        }
      });
  }

  irParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
