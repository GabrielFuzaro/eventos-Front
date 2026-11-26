import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'auth/login', children: [] }])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve autenticar usuário e identificar papel ADMIN corretamente', () => {
    service.login('admin', '123456').subscribe(usuario => {
      expect(usuario.username).toBe('admin');
      expect(usuario.role).toBe('ADMIN');
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ username: 'admin', role: 'ADMIN' });

    expect(service.estaLogado()).toBeTrue();
    expect(service.isAdmin()).toBeTrue();
    expect(service.getUsername()).toBe('admin');
  });

  it('deve carregar sessão via /auth/me e tratar falha sem lançar erro', () => {
    service.carregarUsuario().subscribe(ok => expect(ok).toBeFalse());
    const reqFalha = httpMock.expectOne(`${apiUrl}/me`);
    reqFalha.flush({}, { status: 401, statusText: 'Unauthorized' });

    service.carregarUsuario().subscribe(ok => expect(ok).toBeTrue());
    const reqOk = httpMock.expectOne(`${apiUrl}/me`);
    reqOk.flush({ username: 'cidadao', role: 'USER' });

    expect(service.estaLogado()).toBeTrue();
    expect(service.isAdmin()).toBeFalse();
  });

  it('deve enviar requisição PUT para /auth/alterar-senha', () => {
    let completou = false;
    service.alterarSenha('atual123', 'novaSenha456').subscribe(() => {
      completou = true;
    });

    const req = httpMock.expectOne(`${apiUrl}/alterar-senha`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ senhaAtual: 'atual123', novaSenha: 'novaSenha456' });
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(completou).toBeTrue();
  });

  it('deve limpar sessão ao executar logout', () => {
    service.login('maria', '12345678').subscribe();
    httpMock.expectOne(`${apiUrl}/login`).flush({ username: 'maria', role: 'USER' });

    expect(service.estaLogado()).toBeTrue();
    service.logout();

    const reqLogout = httpMock.expectOne(`${apiUrl}/logout`);
    expect(reqLogout.request.method).toBe('POST');
    reqLogout.flush(null, { status: 204, statusText: 'No Content' });

    expect(service.estaLogado()).toBeFalse();
    expect(service.getUsername()).toBe('');
  });
});
