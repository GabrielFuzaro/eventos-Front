import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, catchError, debounceTime, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { Categoria, corCategoria } from '../models/categoria';
import { Evento, statusEvento } from '../models/evento';
import { OPCOES_TAMANHO_PAGINA, Page, calcularPaginasVisiveis } from '../models/paginacao';
import { AuthService } from '../services/auth.service';
import { CategoriaService } from '../services/categoria.service';
import { EventoService, FiltrosEvento } from '../services/evento.service';
import { NotifierService } from '../services/notifier.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit, OnDestroy {

  eventos: Evento[] = [];
  categorias: Categoria[] = [];

  constructor(
    private eventoService: EventoService,
    private categoriaService: CategoriaService,
    private router: Router,
    public authService: AuthService,
    private notifier: NotifierService
  ) {}

  corCategoria = corCategoria;
  statusEvento = statusEvento;

  erroCarregamento = '';

  carregando = true;
  baixandoExcelEventos = false;
  paginaAtual = 0;
  tamanhoPagina = 10;
  readonly opcoesTamanhoPagina = OPCOES_TAMANHO_PAGINA;
  totalPaginas = 0;
  totalElementos = 0;
  totalAbertos = 0;
  totalLotados = 0;
  totalEncerrados = 0;
  totalVagas = 0;
  mostrarEstatisticas = true;

  // Ordenação clicável nas colunas da tabela
  campoOrdenacao = 'id';
  direcaoOrdenacao: 'asc' | 'desc' = 'desc';

  // Seletor de ocultação de colunas (components.md §22)
  mostrarSeletorColunas = false;
  colunasOcultas: { categoria: boolean; vagas: boolean; status: boolean } = {
    categoria: false,
    vagas: false,
    status: false
  };

  // Filtros combinados enviados para a API (listagem, indicadores e Excel)
  pesquisaEvento = '';
  status = '';
  categoriaId: number | null = null;
  dataInicial = '';
  dataFinal = '';

  statusFormulario = false;
  eventoParaExcluir: Evento | null = null;
  eventoRota: Evento | null = null;

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

    this.carregarCategorias();
    this.carregarEventos();
    this.carregarTotais();
  }

  ngOnDestroy(): void {
    this.inscricoes.unsubscribe();
  }

  get totalEventos(): number {
    return this.totalAbertos + this.totalLotados + this.totalEncerrados;
  }

  get paginas(): number[] {
    return calcularPaginasVisiveis(this.paginaAtual, this.totalPaginas);
  }

  get filtroAtivo(): boolean {
    return !!(this.pesquisaEvento.trim() || this.status || this.categoriaId != null || this.dataInicial || this.dataFinal);
  }

  private get dataInicialIso(): string {
    return this.dataInicial ? `${this.dataInicial}T00:00:00-03:00` : '';
  }

  private get dataFinalIso(): string {
    return this.dataFinal ? `${this.dataFinal}T23:59:59-03:00` : '';
  }

  private get filtros(): FiltrosEvento {
    return {
      nome: this.pesquisaEvento.trim(),
      status: this.status,
      categoriaId: this.categoriaId,
      dataInicial: this.dataInicialIso,
      dataFinal: this.dataFinalIso,
      sort: `${this.campoOrdenacao},${this.direcaoOrdenacao}`
    };
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: lista => this.categorias = lista,
      error: () => {
        this.categorias = [];
      }
    });
  }

  carregarEventos(): void {
    if (this.dataInicial && this.dataFinal && this.dataInicial > this.dataFinal) {
      this.notifier.aviso('A data inicial não pode ser posterior à data final');
      return;
    }
    this.busca$.next();
  }

  private receberEventos(resposta: Page<Evento> | null): void {
    if (resposta) {
      this.eventos = resposta.content;
      this.totalPaginas = resposta.totalPages;
      this.totalElementos = resposta.totalElements;

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

  alternarOrdenacao(campo: string): void {
    if (this.campoOrdenacao === campo) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.campoOrdenacao = campo;
      this.direcaoOrdenacao = 'asc';
    }
    this.paginaAtual = 0;
    this.carregarEventos();
  }

  obterAriaSort(campo: string): 'ascending' | 'descending' | 'none' {
    if (this.campoOrdenacao !== campo) {
      return 'none';
    }
    return this.direcaoOrdenacao === 'asc' ? 'ascending' : 'descending';
  }

  irParaPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas) {
      return;
    }

    this.paginaAtual = pagina;
    this.carregarEventos();
  }

  alterarTamanhoPagina(novoTamanho: number): void {
    this.tamanhoPagina = Number(novoTamanho);
    this.paginaAtual = 0;
    this.carregarEventos();
  }

  pesquisar(texto: string): void {
    this.pesquisaEvento = texto;
    this.pesquisa$.next(texto);
  }

  // Qualquer mudança de filtro volta para a primeira página e atualiza os indicadores
  aplicarFiltros(): void {
    if (this.dataInicial && this.dataFinal && this.dataInicial > this.dataFinal) {
      this.notifier.aviso('A data inicial não pode ser posterior à data final');
      return;
    }
    this.paginaAtual = 0;
    this.carregarEventos();
    this.carregarTotais();
  }

  limparFiltros(): void {
    this.pesquisaEvento = '';
    this.status = '';
    this.categoriaId = null;
    this.dataInicial = '';
    this.dataFinal = '';
    this.aplicarFiltros();
  }

  async carregarTotais(): Promise<void> {
    if (this.dataInicial && this.dataFinal && this.dataInicial > this.dataFinal) {
      return;
    }

    try {
      const indicadores = await firstValueFrom(
        this.eventoService.obterIndicadores({
          categoriaId: this.categoriaId,
          dataInicial: this.dataInicialIso,
          dataFinal: this.dataFinalIso
        })
      );
      this.totalAbertos = indicadores.totalAbertos;
      this.totalLotados = indicadores.totalLotados;
      this.totalEncerrados = indicadores.totalEncerrados;
      this.totalVagas = indicadores.totalVagas;
    } catch {
      try {
        const [abertos, lotados, encerrados] = await Promise.all([
          firstValueFrom(this.eventoService.contarPorStatus('ABERTO')),
          firstValueFrom(this.eventoService.contarPorStatus('LOTADO')),
          firstValueFrom(this.eventoService.contarPorStatus('ENCERRADO'))
        ]);

        this.totalAbertos = abertos;
        this.totalLotados = lotados;
        this.totalEncerrados = encerrados;
        this.totalVagas = 0;
      } catch {
        this.notifier.erro('Não foi possível carregar os indicadores');
      }
    }
  }

  exportarExcelEventos(): void {
    const colunasOcultasAtivas = (Object.keys(this.colunasOcultas) as Array<keyof typeof this.colunasOcultas>)
      .filter(chave => this.colunasOcultas[chave]);

    this.baixandoExcelEventos = true;
    this.eventoService.baixarExcelEventos(this.filtros, colunasOcultasAtivas).subscribe({
      next: (arquivo: Blob) => {
        this.baixandoExcelEventos = false;
        const url = URL.createObjectURL(arquivo);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'eventos.xlsx';
        link.click();
        URL.revokeObjectURL(url);
        this.notifier.sucesso('Planilha de eventos gerada');
      },
      error: async erro => {
        this.baixandoExcelEventos = false;
        let titulo = '';
        try {
          titulo = JSON.parse(await (erro.error as Blob).text())?.titulo ?? '';
        } catch {}
        this.notifier.erro(titulo || 'Não foi possível gerar o Excel de eventos. Tente novamente.');
      }
    });
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
          this.notifier.sucesso('Evento excluído');
        },
        error: erro => {
          this.notifier.erroApi(erro, 'Não foi possível excluir o evento. Tente novamente.');
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
    this.notifier.sucesso('Evento cadastrado');
  }
}
