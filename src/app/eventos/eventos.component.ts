import { Component, HostListener, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { Evento, statusEvento } from '../models/evento';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { corCategoria } from '../models/categoria';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: Evento[] = []

  constructor(private eventoService: EventoService, private router: Router, public authService: AuthService) {}

  ngOnInit(): void{
    this.carregarEventos();
    this.carregarTotais()
  }

  corCategoria = corCategoria;
  statusEvento = statusEvento;

  mensagemSucesso = '';
  mensagemErro = '';

  carregando: boolean = true;
  paginaAtual = 0;
  tamanhoPagina = 8;
  totalPaginas = 0;
  paginacao: boolean = true;
  totalAbertos: number = 0;
  totalLotados: number = 0;
  totalEncerrados: number = 0;
  mostrarEstatisticas: boolean = true;

  pesquisaEvento = '';
  statusFormulario: boolean = false;
  eventoParaExcluir: Evento | null = null;
  status = '';

  get totalEventos(): number {
    return this.totalAbertos + this.totalLotados + this.totalEncerrados;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  get filtroAtivo(): boolean {
    return !!this.status || !this.paginacao;
  }

  carregarEventos(): void {
    this.carregando = true;
    this.eventoService.listarEventos(this.paginaAtual, this.tamanhoPagina)
    .subscribe({
      next: resposta => {
        this.eventos = resposta.content;
        this.totalPaginas = resposta.totalPages;
        this.status = ''
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mostrarErro('Não foi possível carregar os eventos.');
      }
    })
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
    if(this.status === ''){
      this.carregarEventos()
    } else {
      this.filtrarEventos()
    }
  }

  filtrarPorPeriodo(dataInicial: string, dataFinal: string): void {
    if (!dataInicial || !dataFinal) {
      this.mostrarErro('Informe a data inicial e a data final.');
      return;
    }

    this.paginacao = false;
    this.carregando = true;

    const inicio = `${dataInicial}T00:00:00-03:00`;
    const fim = `${dataFinal}T23:59:59-03:00`;

    this.eventoService.listarEventosPeriodo(inicio, fim)
      .subscribe({
        next: resposta => {
          this.eventos = resposta;
          this.carregando = false;
        },
        error: erro => {
          this.carregando = false;
          this.mostrarErro(erro.error?.titulo ?? 'Erro ao buscar eventos do período.');
        }
      });
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

  get eventosFiltrados() {
    return this.eventos.filter(evento =>
      !this.pesquisaEvento ||
      evento.nome.toLowerCase().includes(this.pesquisaEvento.toLowerCase())
    );
  }

  atualizarEventos(){
    // Volta para a primeira página sem filtros, onde o evento recém-cadastrado aparece primeiro
    this.statusFormulario = false;
    this.pesquisaEvento = '';
    this.removerFiltro();
    this.carregarTotais();
    this.mostrarSucesso('Evento cadastrado com sucesso!');
  }

  filtrarEventos(){
    this.carregando = true;
    this.eventoService.filtrarEventosStatus(this.paginaAtual, this.tamanhoPagina, this.status)
    .subscribe({
      next: resposta => {
        this.eventos = resposta.content
        this.totalPaginas = resposta.totalPages
        this.carregando = false;
      },
      error: erro => {
        // A API responde 404 quando não existe nenhum evento com o status
        this.eventos = [];
        this.totalPaginas = 0;
        this.carregando = false;
      }
    })
  }

  aplicarFiltro(){
    this.paginaAtual = 0;
    this.paginacao = true;
    this.filtrarEventos();
  }

  removerFiltro(){
    this.status = ''
    this.paginaAtual = 0
    this.paginacao = true;
    this.carregarEventos()
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
