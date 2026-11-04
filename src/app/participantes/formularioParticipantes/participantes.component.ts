import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipanteService } from '../../services/participante.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { ParticipanteInput } from 'src/app/models/participante';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent {

  constructor(private participanteService: ParticipanteService, private listaEsperaService: ListaEsperaService, private router: Router) {}

  mensagemErro: string = '';
  mensagemSucesso: string ='';

  enviando: boolean = false

  @Input() eventoId!: number;
  @Input() statusEvento!: string;
  @Output() participanteCadastradoOutput = new EventEmitter<void>();

  participanteForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]), 
  })

  // Evento lotado (e que ainda não ocorreu): o formulário passa a inscrever na lista de espera
  get modoListaEspera(): boolean {
    return this.statusEvento === 'LOTADO';
  }

  onSubmit(){

    const participante: ParticipanteInput = {
    nome: this.participanteForm.value.nome!,
    email: this.participanteForm.value.email!,
    eventoId: {
      id: this.eventoId
    }
  };

  this.mensagemErro = '';
  this.mensagemSucesso = '';
  this.enviando = true
  
  if (this.modoListaEspera) {
    this.entrarNaListaDeEspera(participante);
    return;
  }

  this.participanteService.cadastrarParticipante(participante)
  
  .subscribe({
    next: resposta => {
      //("Cadastrado com Sucesso");
      this.mensagemSucesso = 'Participante cadastrado com sucesso!';
      this.participanteCadastradoOutput.emit();
      this.enviando = false
      this.participanteForm.reset();
      setTimeout(() => {
        this.mensagemSucesso = ''
      }, 2000);
    },
    error: erro => {
      //console.log("Erro ao cadastrar", erro)
      this.enviando = false
      this.mensagemErro = erro.error?.titulo ?? 'Erro ao cadastrar participante.';
      this.participanteCadastradoOutput.emit(); //Recarrega o evento: ele pode ter acabado de lotar
      setTimeout(() => {
        this.mensagemErro = ''
      }, 2000);
    }
  });
  }

  entrarNaListaDeEspera(inscricao: ParticipanteInput){
    this.listaEsperaService.entrar(inscricao)
    .subscribe({
      next: resposta => {
        this.mensagemSucesso = `Você entrou na lista de espera na posição ${resposta.posicao}º!`;
        this.participanteCadastradoOutput.emit();
        this.enviando = false
        this.participanteForm.reset();
        setTimeout(() => {
          this.mensagemSucesso = ''
        }, 3500);
      },
      error: erro => {
        this.enviando = false
        this.mensagemErro = erro.error?.titulo ?? 'Erro ao entrar na lista de espera.';
        this.participanteCadastradoOutput.emit(); //Recarrega o evento: pode ter aberto uma vaga
        setTimeout(() => {
          this.mensagemErro = ''
        }, 3500);
      }
    });
  }
}
