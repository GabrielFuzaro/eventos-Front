export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// Opções corporativas padrão CODIUB de itens por página (components.md §5)
export const OPCOES_TAMANHO_PAGINA: readonly number[] = [5, 10, 20];

// Janela deslizante de páginas para evitar estouro horizontal em listas longas
export function calcularPaginasVisiveis(paginaAtual: number, totalPaginas: number, limite = 5): number[] {
    if (totalPaginas <= 0) {
        return [];
    }
    if (totalPaginas <= limite) {
        return Array.from({ length: totalPaginas }, (_, i) => i);
    }
    const metade = Math.floor(limite / 2);
    const inicio = Math.max(0, Math.min(paginaAtual - metade, totalPaginas - limite));
    return Array.from({ length: limite }, (_, i) => inicio + i);
}
