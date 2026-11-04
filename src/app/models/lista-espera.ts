export interface ListaEspera {
    id: number
    eventoId: number
    nome: string
    email: string
    dataInscricao: string
    posicao: number // 1 = próximo a ser chamado quando uma vaga abrir
}
