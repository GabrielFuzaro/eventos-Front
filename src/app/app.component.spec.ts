import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { NotifierComponent } from './compartilhado/notifier/notifier.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        NotifierComponent
      ],
    }).compileComponents();
  });

  it('deve criar o componente raiz', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve renderizar o topo público (logo colorido em barra branca + faixa navy) para usuário comum/visitante', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const logoPublico = el.querySelector('header img') as HTMLImageElement | null;
    const logoFooter = el.querySelector('footer img') as HTMLImageElement | null;

    expect(logoPublico?.getAttribute('src')).toContain('assets/logo/prefeitura/pmu-colorida-horizontal.png');
    expect(logoFooter?.getAttribute('src')).toContain('assets/logo/codiub-branca-horizontal.png');
  });

  it('deve renderizar o layout CMS (logo brasão colorido + texto branco sobre navy e sidebar recolhível) para Admin', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'isAdmin').and.returnValue(true);
    app.areaEventos = true;
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const logoCms = el.querySelector('header img') as HTMLImageElement | null;
    const sidebar = el.querySelector('#menu-lateral');

    expect(app.modoCms).toBeTrue();
    expect(logoCms?.getAttribute('src')).toContain('assets/logo/prefeitura/pmu-colorida-texto-branco-horizontal.png');
    expect(sidebar).toBeTruthy();

    expect(app.sidebarAberta).toBeTrue();
    app.alternarSidebar();
    expect(app.sidebarAberta).toBeFalse();
  });

  it('deve alternar o drawer mobile e fechá-lo ao acionar fecharMenu', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.menuAberto).toBeFalse();

    app.alternarMenu();
    expect(app.menuAberto).toBeTrue();

    app.fecharMenu();
    expect(app.menuAberto).toBeFalse();
  });
});
