import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Usuario } from "../models/Usuario";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private apiUrl = 'http://localhost:8080/auth'

    constructor(private http: HttpClient, private route: Router) {}

    login(username: string, password: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/login`,{
            username: username,
            password: password
        },
    {
        responseType: 'text'
    });
    }

    cadatrar(username: string, senha: string): Observable<Usuario>{
        return this.http.post<Usuario>(`${this.apiUrl}/cadastro`, {
            username: username,
            senha: senha
        })
    }

    logout(): void {
        sessionStorage.removeItem('token');
        this.route.navigate(['/auth/login'])
    }

    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    getRole(): string | null {

        const token = this.getToken();

        if(!token){
            return null;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.role;
    }

    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }
}