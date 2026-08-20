import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Evento } from "../models/evento";
import { Page } from "../models/paginacao";

@Injectable({
    providedIn: 'root'
})
export class EventoService{

    private apiUrl = "http://localhost:8080/eventos"  //Declara a URl para fazer a requisição

    constructor(private http: HttpClient) { }

    listarEventos(page: number, size: number){ //Método para listar eventos com paginação
        return this.http.get<Page<Evento>>(`${this.apiUrl}?page=${page}&size=${size}`)
    }

    filtrarEventosStatus(page: number, size: number, status: string){
        return this.http.get<Page<Evento>>(`${this.apiUrl}/filtro/${status}?page=${page}&size=${size}`)
    }

    buscarPorId(id: number){ //Método para buscar um evento por Id
    return this.http.get<Evento>(
        `${this.apiUrl}/${id}`
    );
}

    cadastrarEvento(evento: Omit<Evento, 'id' | 'status'>){ //Método para cadastrar evento
        return this.http.post<Evento>(this.apiUrl, evento);
    }

    atualizarEvento(id: number, evento: Omit<Evento, 'id' | 'status'>){ //Método para atualizar evento
        return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento);
    }

    excluirEvento(id:number) { //Método para excluir evento
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}