import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

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

    logout(): void {
        sessionStorage.removeItem('token');
        this.route.navigate(['/auth/login'])
    }

    getToken(): string | null {
        return sessionStorage.getItem('token');
    }
}