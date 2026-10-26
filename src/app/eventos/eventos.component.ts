import { Component, ViewChild } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { Evento } from '../models/evento';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  eventos: Evento[] = []

  constructor(private eventoService: EventoService, private router: Router, public authService: AuthService) {}
  
  ngOnInit(): void{
    this.carregarEventos();
    this.carregarTotais()
  }


  mensagemSucesso = '';
  mensagemErro = '';

  paginaAtual = 0;
  tamanhoPagina = 4;
  totalPaginas = 0;
  dataInicial: string = '';
  dataFinal = '';
  paginacao: boolean = true;
  totalAbertos: number = 0;
  totalLotados: number = 0;
  totalEncerrados: number = 0;
  mostrarEstatisticas: boolean = true;

  carregarEventos(): void {
    this.eventoService.listarEventos(this.paginaAtual, this.tamanhoPagina)
    .subscribe(resposta => {
      this.eventos = resposta.content;
      this.totalPaginas = resposta.totalPages;
      this.status = ''
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
    this.mensagemErro = 'Informe a data inicial e a data final.';
    setTimeout(() => { this.mensagemErro = ''; }, 2500);
    return;
  }

  this.paginacao = false;

  const inicio = `${dataInicial}T00:00:00-03:00`;
  const fim = `${dataFinal}T23:59:59-03:00`;

  this.eventoService.listarEventosPeriodo(inicio, fim)
    .subscribe({
      next: resposta => {
        this.eventos = resposta;
      },
      error: erro => {
        this.mensagemErro = erro.error?.titulo ?? 'Erro ao buscar eventos do período.';
        setTimeout(() => { this.mensagemErro = ''; }, 2500);
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
    this.mensagemErro = 'Erro ao carregar estatísticas.';
    setTimeout(() => { this.mensagemErro = ''; }, 2500);
  }
}


  excluirEvento(id: number){

    if (!confirm('Tem certeza que deseja excluir este evento?')) {
        return;
      }

    this.eventoService.excluirEvento(id)
    .subscribe({
      next: resposta => {
        this.carregarEventos()
        this.mensagemSucesso = "Evento excluído com sucesso"
        setTimeout(() => {
          this.mensagemSucesso = ''
        }, 2500);
      },
      error: erro => {
        this.mensagemErro = erro.error?.titulo ?? 'Erro ao excluír Evento'
        setTimeout(() => {
          this.mensagemErro = ''
        }, 2500);
      }
    })
  }

  botaoEditarEvento(id: number){
    this.router.navigate(['./eventos', id, 'edição'])
  }

  imagemLixeira = '../assets/imgs/Lixeira.svg';
  imagemChevronEsquerda = '../assets/imgs/chevron esquerda.svg';
  imagemChevronDireita = '../assets/imgs/chevron_direita.svg'

  pesquisaEvento = '';
  statusFormulario: boolean = false;

  cadastrarEventoFormulario(){
    this.statusFormulario = !this.statusFormulario;
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
    this.carregarEventos();
  }

  status =  '';

  filtrarEventos(){

    this.eventoService.filtrarEventosStatus(this.paginaAtual, this.tamanhoPagina, this.status)
    .subscribe({
      next: resposta => {
        this.eventos = resposta.content
        this.totalPaginas = resposta.totalPages
      },
      error: erro => {
      }
    })
  }

  aplicarFiltro(){
    this.paginaAtual = 0;
    this.filtrarEventos();
  }

  removerFiltro(){
    this.status = ''
    this.paginaAtual = 0
    this.carregarEventos()
    this.paginacao = true;
  }

  logout(): void {
    this.authService.logout()
    //console.log("logout executado")
  }
}
