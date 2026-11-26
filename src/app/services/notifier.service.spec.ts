import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { NotifierService } from './notifier.service';

describe('NotifierService', () => {
  let service: NotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifierService);
  });

  afterEach(() => {
    service.limpar();
  });

  it('deve adicionar notificação de sucesso e removê-la após 3000ms (padrão CODIUB)', fakeAsync(async () => {
    service.sucesso('Evento cadastrado');

    let lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(1);
    expect(lista[0].tipo).toBe('sucesso');
    expect(lista[0].mensagem).toBe('Evento cadastrado');
    expect(lista[0].duracaoMs).toBe(3000);

    tick(2999);
    lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(1);

    tick(1);
    lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(0);
  }));

  it('deve pausar o fechamento automático no hover e retomar ao sair', fakeAsync(async () => {
    service.aviso('Verifique o período selecionado');
    let lista = await firstValueFrom(service.notificacoes$);
    const id = lista[0].id;

    tick(2000);
    service.pausar(id);

    // Mesmo após mais 5 segundos pausado, o toast permanece visível
    tick(5000);
    lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(1);

    // Ao retomar, fecha após o tempo restante (~1000ms)
    service.retomar(id);
    tick(1000);
    lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(0);
  }));

  it('deve evitar duplicatas idênticas consecutivas e respeitar o limite máximo de 4 toasts visíveis', async () => {
    service.info('Mesma mensagem', 0);
    service.info('Mesma mensagem', 0);
    let lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(1);

    service.sucesso('Toast 2', 0);
    service.aviso('Toast 3', 0);
    service.erro('Toast 4', 0);
    service.info('Toast 5', 0);

    lista = await firstValueFrom(service.notificacoes$);
    expect(lista.length).toBe(4);
    expect(lista.map(item => item.mensagem)).toEqual(['Toast 2', 'Toast 3', 'Toast 4', 'Toast 5']);
  });

  it('deve extrair mensagens amigáveis de HttpErrorResponse nos formatos Problem Details e CODIUB', () => {
    const erroCampo = new HttpErrorResponse({
      status: 400,
      error: { campos: [{ nome: 'email', mensagem: 'Informe um e-mail válido.' }] }
    });
    expect(service.extrairMensagemErro(erroCampo, 'Padrão')).toBe('Informe um e-mail válido.');

    const erroTitulo = new HttpErrorResponse({
      status: 422,
      error: { titulo: 'Este evento já está lotado.' }
    });
    expect(service.extrairMensagemErro(erroTitulo, 'Padrão')).toBe('Este evento já está lotado.');

    const erroConexao = new HttpErrorResponse({ status: 0 });
    expect(service.extrairMensagemErro(erroConexao, 'Padrão')).toContain('conectar ao servidor');
  });
});
