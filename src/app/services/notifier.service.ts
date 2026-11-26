import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TipoNotificacao = 'sucesso' | 'erro' | 'aviso' | 'info';

export interface NotificacaoToast {
  id: number;
  tipo: TipoNotificacao;
  mensagem: string;
  duracaoMs: number;
  criadoEm: number;
}

interface ControleTimer {
  timer?: ReturnType<typeof setTimeout>;
  restanteMs: number;
  iniciadoEm: number;
}

// Serviço global de notificações (Toast CODIUB — components.md §13):
// 3 segundos no canto superior direito (ou topo no celular), tipos sucesso, erro, aviso e info.
@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  static readonly DURACAO_PADRAO_MS = 3000;
  private static readonly LIMITE_VISIVEIS = 4;

  private proximoId = 1;
  private readonly notificacoesSubject = new BehaviorSubject<NotificacaoToast[]>([]);
  private readonly timers = new Map<number, ControleTimer>();

  readonly notificacoes$: Observable<NotificacaoToast[]> = this.notificacoesSubject.asObservable();

  sucesso(mensagem: string, duracaoMs = NotifierService.DURACAO_PADRAO_MS): void {
    this.adicionar('sucesso', mensagem, duracaoMs);
  }

  erro(mensagem: string, duracaoMs = NotifierService.DURACAO_PADRAO_MS): void {
    this.adicionar('erro', mensagem, duracaoMs);
  }

  aviso(mensagem: string, duracaoMs = NotifierService.DURACAO_PADRAO_MS): void {
    this.adicionar('aviso', mensagem, duracaoMs);
  }

  info(mensagem: string, duracaoMs = NotifierService.DURACAO_PADRAO_MS): void {
    this.adicionar('info', mensagem, duracaoMs);
  }

  erroApi(erro: unknown, mensagemPadrao = 'Não foi possível concluir a operação. Tente novamente.'): void {
    this.erro(this.extrairMensagemErro(erro, mensagemPadrao));
  }

  // Aliases compatíveis com o padrão legado NotifierService da CODIUB
  showSuccess(message: string): void {
    this.sucesso(message);
  }

  showSucess(message: string): void {
    this.sucesso(message);
  }

  showError(message: string): void {
    this.erro(message);
  }

  showWarning(message: string): void {
    this.aviso(message);
  }

  showInfo(message: string): void {
    this.info(message);
  }

  showErrorAPI(error: unknown, fallback?: string): void {
    this.erroApi(error, fallback);
  }

  pausar(id: number): void {
    const controle = this.timers.get(id);
    if (!controle || !controle.timer) {
      return;
    }
    clearTimeout(controle.timer);
    controle.timer = undefined;
    const decorrido = Date.now() - controle.iniciadoEm;
    controle.restanteMs = Math.max(controle.restanteMs - decorrido, 400);
  }

  retomar(id: number): void {
    const controle = this.timers.get(id);
    if (!controle || controle.timer) {
      return;
    }
    controle.iniciadoEm = Date.now();
    controle.timer = setTimeout(() => this.remover(id), controle.restanteMs);
  }

  remover(id: number): void {
    const controle = this.timers.get(id);
    if (controle?.timer) {
      clearTimeout(controle.timer);
    }
    this.timers.delete(id);

    const atuais = this.notificacoesSubject.value;
    if (atuais.some(item => item.id === id)) {
      this.notificacoesSubject.next(atuais.filter(item => item.id !== id));
    }
  }

  limpar(): void {
    this.timers.forEach(controle => {
      if (controle.timer) {
        clearTimeout(controle.timer);
      }
    });
    this.timers.clear();
    this.notificacoesSubject.next([]);
  }

  extrairMensagemErro(erro: unknown, padrao: string): string {
    const httpErro = erro as HttpErrorResponse | undefined;
    const corpo = httpErro?.error;

    if (corpo && typeof corpo === 'object') {
      if (Array.isArray(corpo.campos) && corpo.campos[0]?.mensagem) {
        return String(corpo.campos[0].mensagem);
      }
      if (corpo.titulo) {
        return String(corpo.titulo);
      }
      if (corpo.message) {
        return String(corpo.message);
      }
      if (Array.isArray(corpo.messages) && corpo.messages[0]) {
        return String(corpo.messages[0]);
      }
    }

    switch (httpErro?.status) {
      case 0:
        return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
      case 401:
        return 'Sua sessão expirou. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'O registro solicitado não foi encontrado.';
      default:
        return padrao;
    }
  }

  private adicionar(tipo: TipoNotificacao, mensagemBruta: string, duracaoMs: number): void {
    const mensagem = mensagemBruta.trim();
    if (!mensagem) {
      return;
    }

    // Evita duplicar exatamente o mesmo toast se disparado em sequência
    const atuais = this.notificacoesSubject.value;
    const duplicada = atuais.find(item => item.tipo === tipo && item.mensagem === mensagem);
    if (duplicada) {
      this.remover(duplicada.id);
    }

    const listaBase = this.notificacoesSubject.value;
    if (listaBase.length >= NotifierService.LIMITE_VISIVEIS) {
      this.remover(listaBase[0].id);
    }

    const id = this.proximoId++;
    const notificacao: NotificacaoToast = {
      id,
      tipo,
      mensagem,
      duracaoMs,
      criadoEm: Date.now()
    };

    this.notificacoesSubject.next([...this.notificacoesSubject.value, notificacao]);

    if (duracaoMs > 0) {
      const timer = setTimeout(() => this.remover(id), duracaoMs);
      this.timers.set(id, {
        timer,
        restanteMs: duracaoMs,
        iniciadoEm: Date.now()
      });
    }
  }
}
