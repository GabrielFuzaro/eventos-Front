// Dados do usuário logado devolvidos pela API (/auth/login e /auth/me). A senha nunca vem da API.
export interface Usuario {
    username: string;
    role: string;
}
