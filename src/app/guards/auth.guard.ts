import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    // O token está num cookie HttpOnly: quem decide se a sessão é válida é a API (/auth/me)
    canActivate(route?: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.authService.carregarUsuario().pipe(
            map(logado => {
                if (!logado) {
                    return this.router.createUrlTree(['/auth/login']);
                }
                if (route?.data?.['role'] === 'ADMIN' && !this.authService.isAdmin()) {
                    return this.router.createUrlTree(['/eventos']);
                }
                return true;
            })
        );
    }
}
