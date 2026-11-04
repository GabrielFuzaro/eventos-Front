import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.authService.getToken();

        if(token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        return next.handle(request).pipe(
            catchError((erro: HttpErrorResponse) => {
                // Token expirado ou inválido (vale 1 hora): limpa a sessão e volta para o login.
                // As rotas /auth ficam de fora, porque lá o 401 significa usuário ou senha errados
                if (erro.status === 401 && token && !request.url.includes('/auth/')) {
                    this.authService.logout();
                }
                return throwError(() => erro);
            })
        );
    }
}
