import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Participante, ParticipanteInput } from "../models/participante";
import { Page } from "../models/paginacao";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ParticipanteService {

    private apiUrl = `${environment.apiUrl}/participantes`;

    constructor( private http: HttpClient) {}

    listarParticipantes(page: number, size: number): Observable<Page<Participante>> {
        return this.http.get<Page<Participante>>(`${this.apiUrl}?page=${page}&size=${size}`);
    }

    listarParticipantesEvento(id: number, page: number, size: number){ //Método para listar os participantes de um evento com paginação
        return this.http.get<Page<Participante>>(`${this.apiUrl}/evento/${id}/?page=${page}&size=${size}`)
    }

    cadastrarParticipante(participante: ParticipanteInput){   //Método para cadastrar participante
        return this.http.post<Participante>(this.apiUrl, participante)
    }

    excluirParticipante(id: number){ //Método para excluir participante
        return this.http.delete(`${this.apiUrl}/${id}`)
    }

    baixarExcel(eventoId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/excel`, {
            params: { eventoId },
            responseType: 'blob'
        });
    }

    contarParticipantes(eventoId: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/quantidade/${eventoId}`);
    }
}
