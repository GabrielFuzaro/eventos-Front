import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ParticipanteService {

    private apiUrl = "http://localhost/8080/parcitipantes"

    constructor( private http: HttpClient) {}

    listarParticipantes(){
        return this.http.get(this.apiUrl);
    }

    cadastrarParticipante(participante: any){
        return this.http.post(this.apiUrl, participante)
    }

    excluirParticipante(id: number){
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}
