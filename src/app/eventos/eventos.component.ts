import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventoService, FiltrosEvento } from '../services/evento.service';
import { Router } from '@angular/router';
import { Evento, statusEvento } from '../models/evento';
import { AuthService } from '../services/auth.service';
import { Subject, Subscription, catchError, debounceTime, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { corCategoria } from '../models/categoria';
import { Page } from '../models/paginacao';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit, OnDestroy {

  eventos: Evento[] = [];

  constructor(private eventoService: EventoService, private router: Router, public authService: AuthService) {}

  corCategoria = corCategoria;
  statusEvento = statusEvento;

  mensagemSucesso = '';
  mensagemErro = '';
  erroCarregamento = '';

  carregando = true;
  paginaAtual = 0;
  tamanhoPagina = 8;
  totalPaginas = 0;
  totalAbertos = 0;
  totalLotados = 0;
  totalEncerrados = 0;
  mostrarEstatisticas = true;

  // Seletor de ocultação de colunas (components.md §22)
  mostrarSeletorColunas = false;
  colunasOcultas: { categoria: boolean; vagas: boolean; status: boolean } = {
    categoria: false,
    vagas: false,
    status: false
  };

  // Filtros: todos são enviados juntos para a API, sempre com paginação
  pesquisaEvento = '';
  status = '';
  dataInicial = '';
  dataFinal = '';

  statusFormulario = false;
  eventoParaExcluir: Evento | null = null;
  eventoRota: Evento | null = null;

  private timerMensagem?: ReturnType<typeof setTimeout>;

  // O foco começa no Cancelar quando o diálogo de exclusão abre
  @ViewChild('botaoCancelarExclusao') set botaoCancelarExclusao(botao: ElementRef<HTMLButtonElement> | undefined) {
    botao?.nativeElement.focus();
  }

  private busca$ = new Subject<void>();
  private pesquisa$ = new Subject<string>();
  private inscricoes = new Subscription();

  ngOnInit(): void {
    // switchMap descarta respostas antigas, então a lista sempre reflete os filtros atuais
    this.inscricoes.add(
      this.busca$.pipe(
        tap(() => {
          this.carregando = true;
          this.erroCarregamento = '';
        }),
        switchMap(() => this.eventoService.listarEventos(this.paginaAtual, this.tamanhoPagina, this.filtros).pipe(
          catchError(erro => {
            const msg = erro.error?.titulo ?? 'Não foi possível carregar os eventos. Verifique sua conexão e tente novamente.';
            this.erroCarregamento = msg;
            return of(null);
          })
        ))
      ).subscribe(resposta => this.receberEventos(resposta))
    );

    // Espera o usuário parar de digitar antes de buscar
    this.inscricoes.add(
      this.pesquisa$.pipe(debounceTime(300))
        .subscribe(() => this.aplicarFiltros())
    );

    this.carregarEventos();
    this.carregarTotais();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timerMensagem);
    this.inscricoes.unsubscribe();
  }

  get totalEventos(): number {
    return this.totalAbertos + this.totalLotados + this.totalEncerrados;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  get filtroAtivo(): boolean {
    return !!(this.pesquisaEvento.trim() || this.status || this.dataInicial || this.dataFinal);
  }

  private get filtros(): FiltrosEvento {
    return {
      nome: this.pesquisaEvento.trim(),
      status: this.status,
      dataInicial: this.dataInicial ? `${this.dataInicial}T00:00:00-03:00` : '',
      dataFinal: this.dataFinal ? `${this.dataFinal}T23:59:59-03:00` : ''
    };
  }

  carregarEventos(): void {
    if (this.dataInicial && this.dataFinal && this.dataInicial > this.dataFinal) {
      this.mostrarErro('A data inicial não pode ser depois da data final.');
      return;
    }
    this.busca$.next();
  }

  private receberEventos(resposta: Page<Evento> | null): void {
    if (resposta) {
      this.eventos = resposta.content;
      this.totalPaginas = resposta.totalPages;

      // A página atual ficou vazia (ex.: último evento dela foi excluído): volta para a última que existe
      if (this.eventos.length === 0 && this.paginaAtual > 0) {
        this.paginaAtual = Math.max(this.totalPaginas - 1, 0);
        this.carregarEventos();
        return;
      }
    }
    this.carregando = false;
  }

  toogleEstatisticas(): boolean {
    this.mostrarEstatisticas = !this.mostrarEstatisticas;
    return this.mostrarEstatisticas;
  }

  alternarSeletorColunas(): void {
    this.mostrarSeletorColunas = !this.mostrarSeletorColunas;
  }

  irParaPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas) {
      return;
    }

    this.paginaAtual = pagina;
    this.carregarEventos();
  }

  pesquisar(texto: string): void {
    this.pesquisaEvento = texto;
    this.pesquisa$.next(texto);
  }

  // Qualquer mudança de filtro volta para a primeira página
  aplicarFiltros(): void {
    this.paginaAtual = 0;
    this.carregarEventos();
  }

  limparFiltros(): void {
    this.pesquisaEvento = '';
    this.status = '';
    this.dataInicial = '';
    this.dataFinal = '';
    this.aplicarFiltros();
  }

  async carregarTotais(): Promise<void> {
    try {
      const [abertos, lotados, encerrados] = await Promise.all([
        firstValueFrom(this.eventoService.contarPorStatus('ABERTO')),
        firstValueFrom(this.eventoService.contarPorStatus('LOTADO')),
        firstValueFrom(this.eventoService.contarPorStatus('ENCERRADO'))
      ]);

      this.totalAbertos = abertos;
      this.totalLotados = lotados;
      this.totalEncerrados = encerrados;
    } catch {
      this.mostrarErro('Não foi possível carregar os indicadores.');
    }
  }

  // Abre o diálogo de confirmação; a exclusão acontece em confirmarExclusao()
  excluirEvento(evento: Evento): void {
    this.eventoParaExcluir = evento;
  }

  confirmarExclusao(): void {
    if (!this.eventoParaExcluir) {
      return;
    }

    const id = this.eventoParaExcluir.id;
    this.eventoParaExcluir = null;

    this.eventoService.excluirEvento(id)
      .subscribe({
        next: () => {
          this.carregarEventos();
          this.carregarTotais();
          this.mostrarSucesso('Evento excluído');
        },
        error: erro => {
          this.mostrarErro(erro.error?.titulo ?? 'Não foi possível excluir o evento. Tente novamente.');
        }
      });
  }

  botaoEditarEvento(id: number): void {
    this.router.navigate(['./eventos', id, 'edicao']);
  }

  cadastrarEventoFormulario(): void {
    this.statusFormulario = !this.statusFormulario;
  }

  abrirModalRota(evento: Evento): void {
    this.eventoRota = evento;
  }

  // Fecha o modal ou o diálogo de exclusão com a tecla Esc
  @HostListener('document:keydown.escape')
  fecharModais(): void {
    this.statusFormulario = false;
    this.eventoParaExcluir = null;
    this.eventoRota = null;
  }

  abrirEvento(id: number): void {
    this.router.navigate(['./eventos', id]);
  }

  atualizarEventos(): void {
    // Volta para a primeira página sem filtros, onde o evento recém-cadastrado aparece primeiro
    this.statusFormulario = false;
    this.limparFiltros();
    this.carregarTotais();
    this.mostrarSucesso('Evento cadastrado');
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
    this.timerMensagem = setTimeout(() => { this.mensagemErro = ''; }, 3500);
  }
}
