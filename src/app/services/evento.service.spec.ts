import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { EventoService } from './evento.service';

describe('EventoService', () => {
  let service: EventoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/eventos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EventoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve enviar parâmetros de paginação, categoriaId, status e ordenação em listarEventos', () => {
    service.listarEventos(1, 20, {
      nome: 'Fórum',
      status: 'ABERTO',
      categoriaId: 3,
      sort: 'data_evento,asc'
    }).subscribe();

    const req = httpMock.expectOne(r => r.url === apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('20');
    expect(req.request.params.get('sort')).toBe('data_evento,asc');
    expect(req.request.params.get('nome')).toBe('Fórum');
    expect(req.request.params.get('status')).toBe('ABERTO');
    expect(req.request.params.get('categoriaId')).toBe('3');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 1, first: false, last: true });
  });

  it('deve consultar indicadores filtrados em /eventos/indicadores', () => {
    service.obterIndicadores({
      categoriaId: 2,
      dataInicial: '2026-11-01T00:00:00-03:00',
      dataFinal: '2026-11-30T23:59:59-03:00'
    }).subscribe(res => {
      expect(res.totalEventos).toBe(5);
      expect(res.totalVagas).toBe(400);
    });

    const req = httpMock.expectOne(r => r.url === `${apiUrl}/indicadores`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('categoriaId')).toBe('2');
    expect(req.request.params.get('dataInicial')).toBe('2026-11-01T00:00:00-03:00');
    expect(req.request.params.get('dataFinal')).toBe('2026-11-30T23:59:59-03:00');
    req.flush({ totalEventos: 5, totalAbertos: 3, totalLotados: 1, totalEncerrados: 1, totalVagas: 400 });
  });

  it('deve solicitar exportação Excel em /eventos/excel com colunasOcultas e responseType blob', () => {
    service.baixarExcelEventos({ status: 'ABERTO', categoriaId: 1 }, ['vagas', 'status']).subscribe(blob => {
      expect(blob.size).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(r => r.url === `${apiUrl}/excel`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    expect(req.request.params.get('status')).toBe('ABERTO');
    expect(req.request.params.get('categoriaId')).toBe('1');
    expect(req.request.params.getAll('colunasOcultas')).toEqual(['vagas', 'status']);
    req.flush(new Blob(['excel-bytes']));
  });
});
