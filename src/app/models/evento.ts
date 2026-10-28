export interface Evento {
    id: number;
    nome: string;
    local: string;
    capacidade_maxima: number;
    status: string;
    data_evento: string;
    categoriaId: number;
    categoriaNome?: string;
}

export interface StatusInfo {
    label: string;
    badge: string;  // classes do badge
    dot: string;    // classe da bolinha / barra
}

// Rótulo e cores de cada status, usados nos cards e nos detalhes
export function statusEvento(status: string): StatusInfo {
    switch (status) {
        case 'LOTADO':
            return { label: 'Lotado', badge: 'bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30', dot: 'bg-rose-400' };
        case 'ENCERRADO':
            return { label: 'Encerrado', badge: 'bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30', dot: 'bg-amber-400' };
        default:
            return { label: 'Aberto', badge: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30', dot: 'bg-emerald-400' };
    }
}
