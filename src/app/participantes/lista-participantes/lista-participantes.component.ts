import { Component, OnChanges } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Participante } from 'src/app/models/participante';
import { ParticipanteService } from 'src/app/services/participante.service';
import { Input } from '@angular/core';
import { Page } from 'src/app/models/paginacao';

@Component({
  selector: 'app-lista-participantes',
  templateUrl: './lista-participantes.component.html',
  styleUrls: ['./lista-participantes.component.css']
})
export class ListaParticipantesComponent implements OnChanges{

  constructor(private participantesService: ParticipanteService, private route: ActivatedRoute) {}

  participantes: Participante[] = [];

  ngOnChanges(){
    if(this.eventoId){

        this.listarParticipantes();

    }
}

  @Input()
  eventoId!: number

  imagemLixeira = '../../assets/imgs/Lixeira.svg';

  mensagemErro = '';
  mensagemSucesso = '';

  paginaAtual = 0;
  tamanhoPagina = 15;
  totalPaginas = 0;

  listarParticipantes(){
    this.participantesService.listarParticipantesEvento(this.eventoId, this.paginaAtual, this.tamanhoPagina)
    .subscribe({
      next: resposta => {
        console.log(resposta);
        this.participantes = resposta.content;
        this.totalPaginas = resposta.totalPages;
      }
    });
  }

  irParaPagina(pagina: number): void{

    if(pagina < 0 || pagina >= this.totalPaginas){
      return;
    }

    this.paginaAtual = pagina;
    this.listarParticipantes();
  }

  excluirParticipante(id: number){
    if(!confirm("Tem certeza que deseja excluír esse participante?")){
      return;
    }

    this.participantesService.excluirParticipante(id)
    .subscribe({
      next: resposta => {
        console.log("Participante excluido com sucesso", resposta)
        this.listarParticipantes()
        this.mensagemSucesso = "Participante excluído com sucesso"
        setTimeout(() => {
          this.mensagemSucesso = ''
        }, 2500);
      },
      error: erro => {
        console.log("Erro ao excluir participante", erro)
        this.mensagemErro = erro.error?.titulo ?? "Erro ao excluír participante"
        setTimeout(() => {
          this.mensagemErro = ''
        }, 2500);
      }
    })
  }
}
