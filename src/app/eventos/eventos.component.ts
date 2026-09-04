import { Component, ViewChild } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { Evento } from '../models/evento';
import { AuthService } from '../services/auth.service';

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
    console.log(this.authService.getRole());
  }


  mensagemSucesso = '';
  mensagemErro = '';

  paginaAtual = 0;
  tamanhoPagina = 4;
  totalPaginas = 0;

  carregarEventos(): void {
    this.eventoService.listarEventos(this.paginaAtual, this.tamanhoPagina)
    .subscribe(resposta => {
      this.eventos = resposta.content;
      this.totalPaginas = resposta.totalPages;
      this.status = ''
    })
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

  excluirEvento(id: number){

    if (!confirm('Tem certeza que deseja excluir este evento?')) {
        return;
      }

    this.eventoService.excluirEvento(id)
    .subscribe({
      next: resposta => {
        console.log("Evento excluído com sucesso")
        this.carregarEventos()
        this.mensagemSucesso = "Evento excluído com sucesso"
        setTimeout(() => {
          this.mensagemSucesso = ''
        }, 2500);
      },
      error: erro => {
        console.log("Falha ao excluír evento", erro)
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
        console.log("Erro ao filtrar eventos", erro)
      }
    })
  }

  aplicarFiltro(){
    console.log("Filtro aplicado")
    this.paginaAtual = 0;
    this.filtrarEventos();
  }

  removerFiltro(){
    this.status = ''
    this.paginaAtual = 0
    this.carregarEventos()
  }

  logout(): void {
    this.authService.logout()
    console.log("logout executado")
  }
}
