import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifierService } from 'src/app/services/notifier.service';
import { NotifierComponent } from './notifier.component';

describe('NotifierComponent', () => {
  let component: NotifierComponent;
  let fixture: ComponentFixture<NotifierComponent>;
  let notifier: NotifierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifierComponent]
    }).compileComponents();

    notifier = TestBed.inject(NotifierService);
    fixture = TestBed.createComponent(NotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    notifier.limpar();
  });

  it('deve renderizar os 4 tipos de toast com as cores, tamanhos e roles do padrão CODIUB', () => {
    notifier.sucesso('Evento cadastrado', 0);
    notifier.erro('Falha ao salvar', 0);
    notifier.aviso('Sessão prestes a expirar', 0);
    notifier.info('Atualização disponível', 0);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const cards = host.querySelectorAll('[role="status"], [role="alert"]');
    expect(cards.length).toBe(4);

    // Sucesso: green-50 + green-700 + role="status"
    expect(cards[0].getAttribute('role')).toBe('status');
    expect(cards[0].className).toContain('bg-green-50');
    expect(cards[0].className).toContain('text-green-700');
    expect(cards[0].className).toContain('min-h-[48px]');
    expect(cards[0].className).toContain('rounded-lg');
    expect(cards[0].className).toContain('shadow-lg');

    // Erro: red-50 + red-700 + border-red-600 + role="alert"
    expect(cards[1].getAttribute('role')).toBe('alert');
    expect(cards[1].className).toContain('bg-red-50');
    expect(cards[1].className).toContain('text-red-700');
    expect(cards[1].className).toContain('border-red-600');

    // Aviso: amber-50 + amber-800 + role="status"
    expect(cards[2].getAttribute('role')).toBe('status');
    expect(cards[2].className).toContain('bg-amber-50');
    expect(cards[2].className).toContain('text-amber-800');

    // Info: blue-50 + codiub-ink + role="status"
    expect(cards[3].getAttribute('role')).toBe('status');
    expect(cards[3].className).toContain('bg-blue-50');
    expect(cards[3].className).toContain('text-codiub-ink');
  });

  it('deve remover a notificação ao clicar no botão fechar', () => {
    notifier.sucesso('Alterações salvas', 0);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const botaoFechar = host.querySelector('button[aria-label="Fechar notificação"]') as HTMLButtonElement;
    expect(botaoFechar).toBeTruthy();

    botaoFechar.click();
    fixture.detectChanges();

    expect(host.querySelectorAll('[role="status"]').length).toBe(0);
  });
});
