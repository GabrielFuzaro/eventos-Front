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

  // Telas internas mostram a sidebar; login e cadastro mostram só navbar e footer
  areaInterna = false;
  menuAberto = false;
  readonly ano = new Date().getFullYear();

  constructor(private router: Router, public authService: AuthService) {
    this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(evento => {
        this.areaInterna = !(evento as NavigationEnd).urlAfterRedirects.startsWith('/auth');
        this.menuAberto = false;
      });
  }

  get primeiroNome(): string {
    return this.authService.getUsername();
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  @HostListener('document:keydown.escape')
  fecharMenu(): void {
    this.menuAberto = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
