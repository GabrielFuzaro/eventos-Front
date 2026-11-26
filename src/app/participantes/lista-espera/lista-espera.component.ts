import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { ListaEspera } from 'src/app/models/lista-espera';
import { OPCOES_TAMANHO_PAGINA, calcularPaginasVisiveis } from 'src/app/models/paginacao';
import { AuthService } from 'src/app/services/auth.service';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.css']
})
export class ListaEsperaComponent implements OnChanges, OnDestroy {

  constructor(private listaEsperaService: ListaEsperaService, public authService: AuthService) {}

  @Input() eventoId!: number;
  @Input() statusEvento!: string;
  @Output() listaAlteradaOutput = new EventEmitter<void>();

  @ViewChild('botaoCancelarFila') set botaoCancelarFila(botao: ElementRef<HTMLButtonElement> | undefined) {
    botao?.nativeElement.focus();
  }

  inscricoes: ListaEspera[] = [];
  inscricaoParaRemover: ListaEspera | null = null;
  totalNaFila = 0;

  mensagemErro = '';
  mensagemSucesso = '';
  private timerMensagem?: ReturnType<typeof setTimeout>;

  paginaAtual = 0;
  tamanhoPagina = 5;
  readonly opcoesTamanhoPagina = OPCOES_TAMANHO_PAGINA;
  totalPaginas = 0;

  get paginas(): number[] {
    return calcularPaginasVisiveis(this.paginaAtual, this.totalPaginas);
  }

  ngOnChanges(): void {
    if (this.eventoId) {
      this.listar();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timerMensagem);
  }

  // A fila só aparece quando o evento está lotado ou quando ainda há gente esperando
  get visivel(): boolean {
    return this.statusEvento === 'LOTADO' || this.totalNaFila > 0;
  }

  listar(): void {
    this.listaEsperaService.listarDoEvento(this.eventoId, this.paginaAtual, this.tamanhoPagina)
      .subscribe({
        next: resposta => {
          if (resposta.content.length === 0 && this.paginaAtual > 0) {
            this.paginaAtual--;
            this.listar();
            return;
          }
          this.inscricoes = resposta.content;
          this.totalPaginas = resposta.totalPages;
          this.totalNaFila = resposta.totalElements;
        },
        error: () => {
          this.inscricoes = [];
          this.totalPaginas = 0;
          this.totalNaFila = 0;
        }
      });
  }

  irParaPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas) {
      return;
    }
    this.paginaAtual = pagina;
    this.listar();
  }

  alterarTamanhoPagina(novoTamanho: number): void {
    this.tamanhoPagina = Number(novoTamanho);
    this.paginaAtual = 0;
    this.listar();
  }

  remover(inscricao: ListaEspera): void {
    this.inscricaoParaRemover = inscricao;
  }

  confirmarRemocao(): void {
    if (!this.inscricaoParaRemover) {
      return;
    }

    const id = this.inscricaoParaRemover.id;
    this.inscricaoParaRemover = null;

    this.listaEsperaService.remover(id)
      .subscribe({
        next: () => {
          this.listar();
          this.listaAlteradaOutput.emit();
          this.mostrarSucesso('Removido da lista de espera');
        },
        error: erro => {
          this.mostrarErro(erro.error?.titulo ?? 'Não foi possível remover da lista de espera. Tente novamente.');
        }
      });
  }

  @HostListener('document:keydown.escape')
  fecharDialogo(): void {
    this.inscricaoParaRemover = null;
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
