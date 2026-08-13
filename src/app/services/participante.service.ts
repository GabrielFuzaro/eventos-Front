import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Participante, ParticipanteInput } from "../models/participante";
import { Page } from "../models/paginacao";

@Injectable({
    providedIn: 'root'
})
export class ParticipanteService {

    private apiUrl = "http://localhost:8080/participantes"

    constructor( private http: HttpClient) {}

    listarParticipantes(page: number, size: number){
        return this.http.get<Participante>(`${this.apiUrl}?page=${page}&size=${size}`);
    }

    listarParticipantesEvento(id: number, page: number, size: number){
        return this.http.get<Page<Participante>>(`${this.apiUrl}/evento/${id}/?page=${page}&size=${size}`)
    }

    cadastrarParticipante(participante: ParticipanteInput){
        return this.http.post<Participante>(this.apiUrl, participante)
    }

    excluirParticipante(id: number){
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}
