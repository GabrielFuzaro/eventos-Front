import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    // O token está num cookie HttpOnly: quem decide se a sessão é válida é a API (/auth/me)
    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.carregarUsuario().pipe(
            map(logado => logado ? true : this.router.createUrlTree(['/auth/login']))
        );
    }
}
