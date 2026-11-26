import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Evento } from "../models/evento";
import { Page } from "../models/paginacao";

export interface FiltrosEvento {
    nome?: string;
    status?: string;
    categoriaId?: number | null;
    dataInicial?: string; // ISO com fuso, ex.: 2026-10-01T00:00:00-03:00
    dataFinal?: string;
    sort?: string;
}

export interface IndicadoresEvento {
    totalEventos: number;
    totalAbertos: number;
    totalLotados: number;
    totalEncerrados: number;
    totalVagas: number;
}

@Injectable({
    providedIn: 'root'
})
export class EventoService {

    private apiUrl = `${environment.apiUrl}/eventos`;

    constructor(private http: HttpClient) { }

    listarEventos(page: number, size: number, filtros: FiltrosEvento = {}): Observable<Page<Evento>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sort', filtros.sort || 'id,desc');

        if (filtros.nome) params = params.set('nome', filtros.nome);
        if (filtros.status) params = params.set('status', filtros.status);
        if (filtros.categoriaId != null) params = params.set('categoriaId', String(filtros.categoriaId));
        if (filtros.dataInicial) params = params.set('dataInicial', filtros.dataInicial);
        if (filtros.dataFinal) params = params.set('dataFinal', filtros.dataFinal);

        return this.http.get<Page<Evento>>(this.apiUrl, { params });
    }

    obterIndicadores(filtros: { categoriaId?: number | null; dataInicial?: string; dataFinal?: string } = {}): Observable<IndicadoresEvento> {
        let params = new HttpParams();
        if (filtros.categoriaId != null) params = params.set('categoriaId', String(filtros.categoriaId));
        if (filtros.dataInicial) params = params.set('dataInicial', filtros.dataInicial);
        if (filtros.dataFinal) params = params.set('dataFinal', filtros.dataFinal);

        return this.http.get<IndicadoresEvento>(`${this.apiUrl}/indicadores`, { params });
    }

    baixarExcelEventos(filtros: FiltrosEvento = {}, colunasOcultas: string[] = []): Observable<Blob> {
        let params = new HttpParams();
        if (filtros.nome) params = params.set('nome', filtros.nome);
        if (filtros.status) params = params.set('status', filtros.status);
        if (filtros.categoriaId != null) params = params.set('categoriaId', String(filtros.categoriaId));
        if (filtros.dataInicial) params = params.set('dataInicial', filtros.dataInicial);
        if (filtros.dataFinal) params = params.set('dataFinal', filtros.dataFinal);
        for (const coluna of colunasOcultas) {
            params = params.append('colunasOcultas', coluna);
        }

        return this.http.get(`${this.apiUrl}/excel`, {
            params,
            responseType: 'blob'
        });
    }

    contarPorStatus(status: string): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/status`, {
            params: { status }
        });
    }

    buscarPorId(id: number): Observable<Evento> {
        return this.http.get<Evento>(`${this.apiUrl}/${id}`);
    }

    cadastrarEvento(evento: Omit<Evento, 'id' | 'status'>): Observable<Evento> {
        return this.http.post<Evento>(this.apiUrl, evento);
    }

    atualizarEvento(id: number, evento: Omit<Evento, 'id' | 'status'>): Observable<Evento> {
        return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento);
    }

    excluirEvento(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
