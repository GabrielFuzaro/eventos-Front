import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListaEspera } from "../models/lista-espera";
import { Page } from "../models/paginacao";
import { ParticipanteInput } from "../models/participante";

@Injectable({
    providedIn: 'root'
})
export class ListaEsperaService {

    private apiUrl = "http://localhost:8080/lista-espera"

    constructor(private http: HttpClient) {}

    listarDoEvento(eventoId: number, page: number, size: number): Observable<Page<ListaEspera>> { //Fila do evento em ordem de chegada
        return this.http.get<Page<ListaEspera>>(`${this.apiUrl}/evento/${eventoId}`, {
            params: { page, size }
        });
    }

    contar(eventoId: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/quantidade/${eventoId}`);
    }

    entrar(inscricao: ParticipanteInput): Observable<ListaEspera> { //Entra na fila de um evento lotado
        return this.http.post<ListaEspera>(this.apiUrl, inscricao);
    }

    remover(id: number) { //Remove alguém da fila (admin)
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
