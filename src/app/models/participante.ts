import { Evento } from "./evento"

export interface Participante{
    id:number
    nome: string
    email: string
    evento: Evento
}

export interface ParticipanteInput {
    nome: string
    email: string
    eventoId: {
        id:number
    }
}