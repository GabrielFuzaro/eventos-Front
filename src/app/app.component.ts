import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  mostrarNavbar = false;

  constructor(private router: Router, public authService: AuthService) {
    // Esconde a barra de navegação nas telas de login e cadastro
    this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(evento => {
        this.mostrarNavbar = !(evento as NavigationEnd).urlAfterRedirects.startsWith('/auth');
      });
  }

  get iniciais(): string {
    return this.authService.getUsername().slice(0, 2).toUpperCase() || '?';
  }

  logout(): void {
    this.authService.logout();
  }
}
