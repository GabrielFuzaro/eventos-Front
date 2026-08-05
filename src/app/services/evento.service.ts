import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EventoService{

    private apiUrl = "http://localhost:8080/eventos"

    constructor(private http: HttpClient) { }

    listarEventos(){
        return this.http.get(this.apiUrl)
    }

    cadastrarEvento(evento: any){
        return this.http.post(this.apiUrl, evento);
    }

    atualizarEvento(id: number, evento: any){
        return this.http.put(`${this.apiUrl}/${id}`, evento);
    }

    excluirEvento(id:number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}