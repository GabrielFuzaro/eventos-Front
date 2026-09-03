import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private apiUrl = 'http://localhost:8080/auth'

    constructor(private http: HttpClient) {}

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
        localStorage.removeItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}