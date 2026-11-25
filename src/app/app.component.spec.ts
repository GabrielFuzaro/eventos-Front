import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { BarraAcessibilidadeComponent } from './compartilhado/barra-acessibilidade/barra-acessibilidade.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        BarraAcessibilidadeComponent
      ],
    }).compileComponents();
  });

  it('deve criar o componente raiz', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve renderizar o logo branco da Prefeitura na navbar e a assinatura CODIUB no rodapé', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const logoNavbar = el.querySelector('header img') as HTMLImageElement | null;
    const logoFooter = el.querySelector('footer img') as HTMLImageElement | null;

    expect(logoNavbar?.getAttribute('src')).toContain('assets/logo/prefeitura/pmu-branca-horizontal.png');
    expect(logoFooter?.getAttribute('src')).toContain('assets/logo/codiub-branca-horizontal.png');
  });

  it('deve alternar o menu lateral e fechá-lo ao acionar fecharMenu', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.menuAberto).toBeFalse();

    app.alternarMenu();
    expect(app.menuAberto).toBeTrue();

    app.fecharMenu();
    expect(app.menuAberto).toBeFalse();
  });
});
