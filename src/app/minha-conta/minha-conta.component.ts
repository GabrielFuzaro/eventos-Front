import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent {

  constructor(public authService: AuthService) {}

  get nomeUsuario(): string {
    return this.authService.getUsername() || 'Usuário';
  }

  get rotuloPerfil(): string {
    return this.authService.isAdmin() ? 'Administrador' : 'Cidadão';
  }

  get siglaPerfil(): string {
    return this.authService.getRole() || 'USER';
  }

  encerrarSessao(): void {
    this.authService.logout();
  }
}
