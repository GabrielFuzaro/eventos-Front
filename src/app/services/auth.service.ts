import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, map, of, tap } from "rxjs";
import { Usuario } from "../models/Usuario";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private apiUrl = 'http://localhost:8080/auth'

    // O token fica num cookie HttpOnly que o JavaScript não consegue ler (protege contra roubo por XSS).
    // Aqui guardamos só os dados públicos do usuário, em memória.
    private usuario: Usuario | null = null;

    constructor(private http: HttpClient, private route: Router) {
        sessionStorage.removeItem('token'); // Limpa o token salvo pela versão antiga do front
    }

    login(username: string, password: string): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.apiUrl}/login`, { username, password })
            .pipe(tap(usuario => this.usuario = usuario));
    }

    cadatrar(username: string, senha: string): Observable<Usuario>{
        return this.http.post<Usuario>(`${this.apiUrl}/cadastro`, { username, senha })
    }

    // Pergunta à API quem está logado (usa o cookie). Retorna false se não houver sessão válida.
    carregarUsuario(): Observable<boolean> {
        if (this.usuario) {
            return of(true);
        }
        return this.http.get<Usuario>(`${this.apiUrl}/me`).pipe(
            tap(usuario => this.usuario = usuario),
            map(() => true),
            catchError(() => of(false))
        );
    }

    logout(): void {
        // A API apaga o cookie; mesmo se a chamada falhar, a sessão local é encerrada
        this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
            complete: () => this.encerrarSessao(),
            error: () => this.encerrarSessao()
        });
    }

    // Usado quando a API responde 401 (token expirado ou inválido)
    encerrarSessao(): void {
        this.usuario = null;
        this.route.navigate(['/auth/login']);
    }

    estaLogado(): boolean {
        return this.usuario !== null;
    }

    getRole(): string | null {
        return this.usuario?.role ?? null;
    }

    getUsername(): string {
        return this.usuario?.username ?? '';
    }

    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }
}
