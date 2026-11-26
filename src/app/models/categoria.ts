export interface Categoria {
    id: number;
    nome: string;
    ativa?: boolean;
}

// Categoria é informação, não estado: usa a badge navy do design CODIUB (sem cores novas)
export function corCategoria(categoriaId?: number | null): string {
    return categoriaId ? 'bg-navy-tint text-codiub-navy' : 'bg-gray-100 text-gray-700';
}
