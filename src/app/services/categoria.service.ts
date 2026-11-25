import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Categoria } from "../models/categoria";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root"
})

export class CategoriaService{

    private apiUrl = `${environment.apiUrl}/categorias`;

    constructor(private http: HttpClient){}

    listarCategorias(): Observable<Categoria[]>{
        return this.http.get<Categoria[]>(`${this.apiUrl}`);
    }
}