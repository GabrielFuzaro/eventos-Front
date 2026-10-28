import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Categoria } from "../models/categoria";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class CategoriaService{

    private apiUrl = "http://localhost:8080/categorias";

    constructor(private http: HttpClient){}

    listarCategorias(): Observable<Categoria[]>{
        return this.http.get<Categoria[]>(`${this.apiUrl}`);
    }
}