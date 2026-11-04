import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ListaEspera } from 'src/app/models/lista-espera';
import { AuthService } from 'src/app/services/auth.service';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.css']
})
export class ListaEsperaComponent implements OnChanges {

  constructor(private listaEsperaService: ListaEsperaService, public authService: AuthService) {}

  @Input() eventoId!: number;
  @Input() statusEvento!: string;
  @Output() listaAlteradaOutput = new EventEmitter<void>();

  inscricoes: ListaEspera[] = [];
  totalNaFila = 0;

  imagemLixeira = '../../assets/imgs/Lixeira.svg';

  mensagemErro = '';
  mensagemSucesso = '';

  paginaAtual = 0;
  tamanhoPagina = 5;
  totalPaginas = 0;

  ngOnChanges() {
    if (this.eventoId) {
      this.listar();
    }
  }

  // A fila só aparece quando o evento está lotado ou quando ainda há gente esperando
  get visivel(): boolean {
    return this.statusEvento === 'LOTADO' || this.totalNaFila > 0;
  }

  listar() {
    this.listaEsperaService.listarDoEvento(this.eventoId, this.paginaAtual, this.tamanhoPagina)
      .subscribe({
        next: resposta => {
          // Se a página atual ficou vazia (ex.: pessoas promovidas), volta para a anterior
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

  remover(inscricao: ListaEspera) {
    if (!confirm(`Remover ${inscricao.nome} da lista de espera?`)) {
      return;
    }

    this.listaEsperaService.remover(inscricao.id)
      .subscribe({
        next: () => {
          this.listar();
          this.listaAlteradaOutput.emit();
          this.mensagemSucesso = 'Removido da lista de espera';
          setTimeout(() => this.mensagemSucesso = '', 2500);
        },
        error: erro => {
          this.mensagemErro = erro.error?.titulo ?? 'Erro ao remover da lista de espera';
          setTimeout(() => this.mensagemErro = '', 2500);
        }
      });
  }
}
