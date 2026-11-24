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
    badge: string;  // classes do badge (fundo + texto, contraste AA)
    dot: string;    // classe da bolinha que acompanha o texto
}

// Rótulo e cores de cada status (tokens de feedback CODIUB), usados na listagem e nos detalhes
export function statusEvento(status: string): StatusInfo {
    switch (status) {
        case 'LOTADO':
            return { label: 'Lotado', badge: 'bg-red-50 text-red-700', dot: 'bg-red-600' };
        case 'ENCERRADO':
            return { label: 'Encerrado', badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
        default:
            return { label: 'Aberto', badge: 'bg-green-50 text-green-700', dot: 'bg-green-700' };
    }
}

// Converte a data da API para o valor de um input datetime-local (yyyy-MM-ddTHH:mm), no fuso de Brasília
export function paraInputDataHora(data: string | null | undefined): string {
    if (!data) {
        return '';
    }
    const temFuso = /([zZ]|[+-]\d{2}:?\d{2})$/.test(data);
    if (!temFuso) {
        return data.slice(0, 16);
    }
    // Brasília não tem horário de verão: UTC-3 fixo
    const brasilia = new Date(new Date(data).getTime() - 3 * 60 * 60 * 1000);
    return brasilia.toISOString().slice(0, 16);
}

// Agora, no formato de datetime-local e no fuso de Brasília (usado como data mínima)
export function agoraInputDataHora(): string {
    return paraInputDataHora(new Date().toISOString());
}
