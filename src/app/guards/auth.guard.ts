import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private aurhService: AuthService, private router: Router) {}


    canActivate(): boolean {
        
        if(this.aurhService.isTokenValido()){
            return true;
        }

        sessionStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
        
        return false
    }
}