import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable, catchError, throwError } from "rxjs";

const API_URL = 'http://localhost:8080';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Envia o cookie HttpOnly do token só para a nossa API (nunca para outros domínios)
        if (request.url.startsWith(API_URL)) {
            request = request.clone({ withCredentials: true });
        }

        return next.handle(request).pipe(
            catchError((erro: HttpErrorResponse) => {
                // Sessão expirada ou inválida: volta para o login.
                // /auth/login (senha errada) e /auth/me (checagem do guard) tratam o 401 por conta própria
                const rotaDeAutenticacao = request.url.includes('/auth/login') || request.url.includes('/auth/me');
                if (erro.status === 401 && request.url.startsWith(API_URL) && !rotaDeAutenticacao) {
                    this.authService.encerrarSessao();
                }
                return throwError(() => erro);
            })
        );
    }
}
