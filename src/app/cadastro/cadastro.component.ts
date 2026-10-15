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

  cadastroFormulario = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required]}),
    senha: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
  })

  enviarCadastro() {
    const usuario = this.cadastroFormulario.getRawValue();
    
    this.authService.cadatrar(usuario.username, usuario.senha) 
    .subscribe({
      next: resposta => {
        console.log("Cadastro realizado:", resposta);
        this.cadastroFormulario.reset()
      },
      error: erro => {
        this.mensagemErro = erro.error?.titulo
        console.log("Erro ao cadastrar:", erro)
        setTimeout(() => {
          this.mensagemErro = '';
        }, 2500);
      }
    })
  }

  irParaLogin(): void {
    this.router.navigate([
      './auth/login'
    ])
  }
}
