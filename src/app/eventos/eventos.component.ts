import { Component, ViewChild } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { Evento } from '../models/evento';
import { FormularioEventosComponent } from './formulario-eventos/formulario-eventos.component';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  eventos: Evento[] = []

  constructor(private eventoService: EventoService, private router: Router) {}

  @ViewChild(FormularioEventosComponent)
  formularioEventos!: FormularioEventosComponent;
  
  ngOnInit(): void{
    this.carregarEventos();
  }


  eventoHoje(dataEvento: string): boolean {
   return new Date(dataEvento) < new Date;
  }

  dataHoje = new Date();
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
    })
  }

  irParaPagina(pagina: number): void{

    if(pagina < 0 || pagina >= this.totalPaginas){
      return;
    }

    this.paginaAtual = pagina;
    this.carregarEventos();
  }

  excluirEvento(id: number){

    if (!confirm('Tem certeza que deseja excluir este evento?')) {
        return;
      }

    this.eventoService.excluirEvento(id)
    .subscribe({
      next: resposta => {
        console.log("Evento excluído com sucesso", resposta)
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
}
