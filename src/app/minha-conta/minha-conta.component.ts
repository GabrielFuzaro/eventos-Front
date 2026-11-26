import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent {

  enviando = false;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;

  senhaForm = new FormGroup(
    {
      senhaAtual: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      novaSenha: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)]
      }),
      confirmarSenha: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    },
    { validators: MinhaContaComponent.validarConfirmacaoSenha }
  );

  constructor(public authService: AuthService, private notifier: NotifierService) {}

  static validarConfirmacaoSenha(grupo: AbstractControl): ValidationErrors | null {
    const nova = grupo.get('novaSenha')?.value;
    const confirmacao = grupo.get('confirmarSenha')?.value;
    if (nova && confirmacao && nova !== confirmacao) {
      return { senhasDivergentes: true };
    }
    return null;
  }

  get nomeUsuario(): string {
    return this.authService.getUsername() || 'Usuário';
  }

  get rotuloPerfil(): string {
    return this.authService.isAdmin() ? 'Administrador' : 'Cidadão';
  }

  get siglaPerfil(): string {
    return this.authService.getRole() || 'USER';
  }

  invalido(campo: 'senhaAtual' | 'novaSenha' | 'confirmarSenha'): boolean {
    const controle = this.senhaForm.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  get confirmacaoDivergente(): boolean {
    const controle = this.senhaForm.get('confirmarSenha');
    return !!controle && controle.touched && this.senhaForm.hasError('senhasDivergentes');
  }

  alterarSenha(): void {
    if (this.senhaForm.invalid) {
      this.senhaForm.markAllAsTouched();
      return;
    }

    const { senhaAtual, novaSenha } = this.senhaForm.getRawValue();
    this.enviando = true;

    this.authService.alterarSenha(senhaAtual, novaSenha).subscribe({
      next: () => {
        this.enviando = false;
        this.senhaForm.reset();
        this.notifier.sucesso('Senha alterada com sucesso');
      },
      error: erro => {
        this.enviando = false;
        this.notifier.erroApi(erro, 'Não foi possível alterar a senha.');
      }
    });
  }

  encerrarSessao(): void {
    this.authService.logout();
  }
}
