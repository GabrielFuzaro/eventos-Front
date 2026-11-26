import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { NotifierService } from "../services/notifier.service";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment";

const API_URL = environment.apiUrl;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private notifier: NotifierService
    ) {}

    intercept(
        request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Envia o cookie HttpOnly do token só para a nossa API (nunca para outros domínios)
        if (request.url.startsWith(API_URL)) {
            request = request.clone({ withCredentials: true });
        }

        return next.handle(request).pipe(
            catchError((erro: HttpErrorResponse) => {
                // Sessão expirada ou inválida: volta para o login e informa o usuário.
                // /auth/login (senha errada) e /auth/me (checagem do guard) tratam o 401 por conta própria
                const rotaDeAutenticacao = request.url.includes('/auth/login') || request.url.includes('/auth/me');
                if (erro.status === 401 && request.url.startsWith(API_URL) && !rotaDeAutenticacao) {
                    this.notifier.aviso('Sua sessão expirou. Faça login novamente');
                    this.authService.encerrarSessao();
                }
                return throwError(() => erro);
            })
        );
    }
}
