import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Evento } from "../models/evento";

@Injectable({
    providedIn: 'root'
})
export class EventoService{

    private apiUrl = "http://localhost:8080/eventos"

    constructor(private http: HttpClient) { }

    listarEventos(){
        return this.http.get<Evento[]>(this.apiUrl)
    }

    buscarPorId(id: number){
    return this.http.get<Evento>(
        `${this.apiUrl}/${id}`
    );
}

    cadastrarEvento(evento: Omit<Evento, 'id' | 'status'>){
        return this.http.post<Evento>(this.apiUrl, evento);
    }

    atualizarEvento(id: number, evento: Omit<Evento, 'id' | 'status'>){
        return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento);
    }

    excluirEvento(id:number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}