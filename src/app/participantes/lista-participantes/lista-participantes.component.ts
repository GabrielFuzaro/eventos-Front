import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { Participante } from 'src/app/models/participante';
import { OPCOES_TAMANHO_PAGINA, calcularPaginasVisiveis } from 'src/app/models/paginacao';
import { ParticipanteService } from 'src/app/services/participante.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista-participantes',
  templateUrl: './lista-participantes.component.html',
  styleUrls: ['./lista-participantes.component.css']
})
export class ListaParticipantesComponent implements OnChanges, OnDestroy {

  constructor(private participantesService: ParticipanteService, public authService: AuthService) {}

  participantes: Participante[] = [];
  participanteParaExcluir: Participante | null = null;
  private timerMensagem?: ReturnType<typeof setTimeout>;

  @Input() eventoId!: number;
  @Input() totalParticipantes = 0;
  @Output() participanteExcluidoOutput = new EventEmitter<void>();

  @ViewChild('botaoCancelarParticipante') set botaoCancelarParticipante(botao: ElementRef<HTMLButtonElement> | undefined) {
    botao?.nativeElement.focus();
  }

  mensagemErro = '';
  mensagemSucesso = '';

  paginaAtual = 0;
  tamanhoPagina = 10;
  readonly opcoesTamanhoPagina = OPCOES_TAMANHO_PAGINA;
  totalPaginas = 0;

  get paginas(): number[] {
    return calcularPaginasVisiveis(this.paginaAtual, this.totalPaginas);
  }

  ngOnChanges(): void {
    if (this.eventoId) {
      this.listarParticipantes();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timerMensagem);
  }

  listarParticipantes(): void {
    this.participantesService.listarParticipantesEvento(this.eventoId, this.paginaAtual, this.tamanhoPagina)
      .subscribe({
        next: resposta => {
          if (resposta.content.length === 0 && this.paginaAtual > 0) {
            this.paginaAtual--;
            this.listarParticipantes();
            return;
          }
          this.participantes = resposta.content;
          this.totalPaginas = resposta.totalPages;
        },
        error: erro => {
          this.mostrarErro(erro.error?.titulo ?? 'Não foi possível carregar os participantes.');
        }
      });
  }

  irParaPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas) {
      return;
    }

    this.paginaAtual = pagina;
    this.listarParticipantes();
  }

  alterarTamanhoPagina(novoTamanho: number): void {
    this.tamanhoPagina = Number(novoTamanho);
    this.paginaAtual = 0;
    this.listarParticipantes();
  }

  excluirParticipante(participante: Participante): void {
    this.participanteParaExcluir = participante;
  }

  confirmarExclusao(): void {
    if (!this.participanteParaExcluir) {
      return;
    }

    const id = this.participanteParaExcluir.id;
    this.participanteParaExcluir = null;

    this.participantesService.excluirParticipante(id)
      .subscribe({
        next: () => {
          this.listarParticipantes();
          this.participanteExcluidoOutput.emit();
          this.mostrarSucesso('Participante excluído');
        },
        error: erro => {
          this.mostrarErro(erro.error?.titulo ?? 'Não foi possível excluir o participante. Tente novamente.');
        }
      });
  }

  @HostListener('document:keydown.escape')
  fecharDialogo(): void {
    this.participanteParaExcluir = null;
  }

  private mostrarSucesso(mensagem: string): void {
    clearTimeout(this.timerMensagem);
    this.mensagemErro = '';
    this.mensagemSucesso = mensagem;
    this.timerMensagem = setTimeout(() => { this.mensagemSucesso = ''; }, 2500);
  }

  private mostrarErro(mensagem: string): void {
    clearTimeout(this.timerMensagem);
    this.mensagemSucesso = '';
    this.mensagemErro = mensagem;
    this.timerMensagem = setTimeout(() => { this.mensagemErro = ''; }, 3000);
  }
}
