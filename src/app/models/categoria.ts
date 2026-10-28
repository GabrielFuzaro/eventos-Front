export interface Categoria{
    id: number;
    nome: string;
    ativa: boolean;
}

// Cores dos badges de categoria (evita as cores já usadas nos status)
const CORES_CATEGORIAS = [
    'bg-indigo-500/15 text-indigo-300',   // 1 Palestra
    'bg-violet-500/15 text-violet-300',   // 2 Workshop
    'bg-fuchsia-500/15 text-fuchsia-300', // 3 Show
    'bg-sky-500/15 text-sky-300',         // 4 Curso
    'bg-orange-500/15 text-orange-300',   // 5 Networking
    'bg-lime-500/15 text-lime-300'        // 6 Esporte
];

export function corCategoria(categoriaId?: number | null): string {
    if (!categoriaId) {
        return 'bg-slate-800 text-slate-500';
    }
    // Novas categorias reaproveitam a paleta em ciclo
    return CORES_CATEGORIAS[(categoriaId - 1) % CORES_CATEGORIAS.length];
}