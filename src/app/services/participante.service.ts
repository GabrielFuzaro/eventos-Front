import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ParticipanteInput } from "../models/participante";

@Injectable({
    providedIn: 'root'
})
export class ParticipanteService {

    private apiUrl = "http://localhost:8080/participantes"

    constructor( private http: HttpClient) {}

    listarParticipantes(){
        return this.http.get(this.apiUrl);
    }

    listarParticipantesEvento(id: number){
        return this.http.get(`${this.apiUrl}/evento/${id}`)
    }

    cadastrarParticipante(participante: ParticipanteInput){
        return this.http.post(this.apiUrl, participante)
    }

    excluirParticipante(id: number){
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}
