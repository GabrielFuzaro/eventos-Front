import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Evento } from "../models/evento";
import { Page } from "../models/paginacao";

export interface FiltrosEvento {
    nome?: string;
    status?: string;
    dataInicial?: string; // ISO com fuso, ex.: 2026-10-01T00:00:00-03:00
    dataFinal?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventoService{

    private apiUrl = "http://localhost:8080/eventos"  //Declara a URl para fazer a requisição

    constructor(private http: HttpClient) { }

    listarEventos(page: number, size: number, filtros: FiltrosEvento = {}){ //Lista eventos com paginação, combinando os filtros informados
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sort', 'id,desc'); //Mais recentes primeiro

        if (filtros.nome) params = params.set('nome', filtros.nome);
        if (filtros.status) params = params.set('status', filtros.status);
        if (filtros.dataInicial) params = params.set('dataInicial', filtros.dataInicial);
        if (filtros.dataFinal) params = params.set('dataFinal', filtros.dataFinal);

        return this.http.get<Page<Evento>>(this.apiUrl, { params });
    }

    contarPorStatus(status: string){
        return this.http.get<number>(`${this.apiUrl}/status`, {
            params: {status}
        }
        );
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