import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Rotas autenticadas internas (/eventos* e /minha-conta); login, cadastro e 404 ficam fora
  areaEventos = false;
  menuAberto = false;
  sidebarAberta = true;
  cadastrosAberto = true;
  readonly ano = new Date().getFullYear();

  constructor(private router: Router, public authService: AuthService) {
    this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(evento => {
        const url = (evento as NavigationEnd).urlAfterRedirects;
        this.areaEventos = url.startsWith('/eventos') || url.startsWith('/minha-conta');
        this.menuAberto = false;
      });
  }

  // Administradores nas telas de eventos usam o Layout CMS (Print 1);
  // Usuários comuns e telas de autenticação usam o Layout Público (Print 2)
  get modoCms(): boolean {
    return this.areaEventos && this.authService.isAdmin();
  }

  get primeiroNome(): string {
    return this.authService.getUsername();
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  alternarSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
  }

  alternarGrupoCadastros(): void {
    if (!this.sidebarAberta) {
      this.sidebarAberta = true;
      this.cadastrosAberto = true;
      return;
    }
    this.cadastrosAberto = !this.cadastrosAberto;
  }

  @HostListener('document:keydown.escape')
  fecharMenu(): void {
    this.menuAberto = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
