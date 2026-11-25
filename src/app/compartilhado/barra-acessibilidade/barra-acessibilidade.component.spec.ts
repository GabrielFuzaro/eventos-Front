import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarraAcessibilidadeComponent } from './barra-acessibilidade.component';

describe('BarraAcessibilidadeComponent', () => {
  let component: BarraAcessibilidadeComponent;
  let fixture: ComponentFixture<BarraAcessibilidadeComponent>;

  beforeEach(async () => {
    localStorage.removeItem('codiub_a11y_prefs');
    document.documentElement.classList.remove('a11y-contraste', 'a11y-sem-animacao');
    document.documentElement.style.fontSize = '';

    await TestBed.configureTestingModule({
      declarations: [BarraAcessibilidadeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BarraAcessibilidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.resetar();
  });

  it('deve alternar o modo de alto contraste no elemento html', () => {
    expect(document.documentElement.classList.contains('a11y-contraste')).toBeFalse();
    component.alternarContraste();
    expect(document.documentElement.classList.contains('a11y-contraste')).toBeTrue();
    component.resetar();
    expect(document.documentElement.classList.contains('a11y-contraste')).toBeFalse();
  });

  it('deve ajustar e resetar a escala de fonte respeitando os limites', () => {
    component.aumentarFonte();
    expect(component.escalaFonte).toBe(112.5);
    expect(document.documentElement.style.fontSize).toBe('112.5%');

    component.resetar();
    expect(component.escalaFonte).toBe(100);
  });
});
