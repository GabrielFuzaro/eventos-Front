import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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

  eventos: Evento[] = []

  constructor(private eventoService: EventoService, private router: Router, public authService: AuthService) {}

  corCategoria = corCategoria;
  statusEvento = statusEvento;

  mensagemSucesso = '';
  mensagemErro = '';

  carregando: boolean = true;
  paginaAtual = 0;
  tamanhoPagina = 8;
  totalPaginas = 0;
  totalAbertos: number = 0;
  totalLotados: number = 0;
  totalEncerrados: number = 0;
  mostrarEstatisticas: boolean = true;

  // Filtros: todos são enviados juntos para a API, sempre com paginação
  pesquisaEvento = '';
  status = '';
  dataInicial = '';
  dataFinal = '';

  statusFormulario: boolean = false;
  eventoParaExcluir: Evento | null = null;

  private busca$ = new Subject<void>();
  private pesquisa$ = new Subject<string>();
  private inscricoes = new Subscription();

  ngOnInit(): void{
    // switchMap descarta respostas antigas, então a lista sempre reflete os filtros atuais
    this.inscricoes.add(
      this.busca$.pipe(
        tap(() => this.carregando = true),
        switchMap(() => this.eventoService.listarEventos(this.paginaAtual, this.tamanhoPagina, this.filtros).pipe(
          catchError(erro => {
            this.mostrarErro(erro.error?.titulo ?? 'Não foi possível carregar os eventos.');
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
    this.carregarTotais()
  }

  ngOnDestroy(): void {
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

  toogleEstatisticas(): boolean{
    const toogle = this.mostrarEstatisticas = !this.mostrarEstatisticas;
    return toogle
  }

  irParaPagina(pagina: number): void{
    if(pagina < 0 || pagina >= this.totalPaginas){
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
    } catch (error) {
      this.mostrarErro('Erro ao carregar estatísticas.');
    }
  }

  // Abre o diálogo de confirmação; a exclusão acontece em confirmarExclusao()
  excluirEvento(evento: Evento){
    this.eventoParaExcluir = evento;
  }

  confirmarExclusao(){
    if (!this.eventoParaExcluir) {
      return;
    }

    const id = this.eventoParaExcluir.id;
    this.eventoParaExcluir = null;

    this.eventoService.excluirEvento(id)
    .subscribe({
      next: () => {
        this.carregarEventos()
        this.carregarTotais()
        this.mostrarSucesso('Evento excluído com sucesso.');
      },
      error: erro => {
        this.mostrarErro(erro.error?.titulo ?? 'Erro ao excluir evento.');
      }
    })
  }

  botaoEditarEvento(id: number){
    this.router.navigate(['./eventos', id, 'edição'])
  }

  cadastrarEventoFormulario(){
    this.statusFormulario = !this.statusFormulario;
  }

  // Fecha o modal ou o diálogo de exclusão com a tecla Esc
  @HostListener('document:keydown.escape')
  fecharModais(){
    this.statusFormulario = false;
    this.eventoParaExcluir = null;
  }

  abrirEvento(id: number){
    this.router.navigate([
      './eventos',
      id
    ]);
  }

  atualizarEventos(){
    // Volta para a primeira página sem filtros, onde o evento recém-cadastrado aparece primeiro
    this.statusFormulario = false;
    this.limparFiltros();
    this.carregarTotais();
    this.mostrarSucesso('Evento cadastrado com sucesso!');
  }

  private mostrarSucesso(mensagem: string){
    this.mensagemSucesso = mensagem;
    setTimeout(() => { this.mensagemSucesso = ''; }, 2500);
  }

  private mostrarErro(mensagem: string){
    this.mensagemErro = mensagem;
    setTimeout(() => { this.mensagemErro = ''; }, 3000);
  }
}
