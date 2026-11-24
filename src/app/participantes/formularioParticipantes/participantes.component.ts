import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
  private timerMensagem?: ReturnType<typeof setTimeout>;

  @Input() eventoId!: number;
  @Input() statusEvento!: string;
  @Output() participanteCadastradoOutput = new EventEmitter<void>();

  participanteForm = new FormGroup({
    // Mesmos limites da API: nome até 30 e email até 40 caracteres
    nome: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
  })

  get encerrado(): boolean {
    return this.statusEvento === 'ENCERRADO';
  }

  invalido(campo: string): boolean {
    const controle = this.participanteForm.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

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
    next: () => {
      this.mostrarSucesso('Participante inscrito');
      this.participanteCadastradoOutput.emit();
      this.enviando = false
      this.participanteForm.reset();
    },
    error: erro => {
      this.enviando = false
      this.mostrarErro(this.mensagemDeErro(erro, 'Não foi possível fazer a inscrição. Tente novamente.'));
      this.participanteCadastradoOutput.emit(); //Recarrega o evento: ele pode ter acabado de lotar
    }
  });
  }

  entrarNaListaDeEspera(inscricao: ParticipanteInput){
    this.listaEsperaService.entrar(inscricao)
    .subscribe({
      next: resposta => {
        this.mostrarSucesso(`Inscrição feita na lista de espera, na posição ${resposta.posicao}º`);
        this.participanteCadastradoOutput.emit();
        this.enviando = false
        this.participanteForm.reset();
      },
      error: erro => {
        this.enviando = false
        this.mostrarErro(this.mensagemDeErro(erro, 'Não foi possível entrar na lista de espera. Tente novamente.'));
        this.participanteCadastradoOutput.emit(); //Recarrega o evento: pode ter aberto uma vaga
      }
    });
  }

  // Usa a mensagem da API ("titulo"); sem ela, explica a causa pelo status HTTP
  private mensagemDeErro(erro: HttpErrorResponse, padrao: string): string {
    if (erro.error?.titulo) {
      return erro.error.titulo;
    }
    switch (erro.status) {
      case 0:
        return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
      case 401:
        return 'Sua sessão expirou. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para fazer isso.';
      case 404:
        return 'Não encontramos esse recurso no servidor. Tente novamente mais tarde.';
      default:
        return padrao;
    }
  }

  // Cada nova mensagem cancela o timer da anterior, senão o timer antigo apagaria a mensagem nova antes da hora
  private mostrarSucesso(mensagem: string){
    clearTimeout(this.timerMensagem);
    this.mensagemErro = '';
    this.mensagemSucesso = mensagem;
    this.timerMensagem = setTimeout(() => this.mensagemSucesso = '', 3500);
  }

  private mostrarErro(mensagem: string){
    clearTimeout(this.timerMensagem);
    this.mensagemSucesso = '';
    this.mensagemErro = mensagem;
    this.timerMensagem = setTimeout(() => this.mensagemErro = '', 3500);
  }
}
