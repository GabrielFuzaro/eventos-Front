import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipanteService } from '../../services/participante.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { ParticipanteInput } from 'src/app/models/participante';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent {

  constructor(private participanteService: ParticipanteService, private router: Router) {}

  mensagemErro: string = '';
  mensagemSucesso: string ='';

  enviando: boolean = false

  @Input() eventoId!: number;
  @Input() statusEvento!: string;
  @Output() participatenCadastradoOutput = new EventEmitter<void>();

  participanteForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]), 
  })

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
  
  this.participanteService.cadastrarParticipante(participante)
  
  .subscribe({
    next: resposta => {
      console.log("Cadastrado com Sucesso", resposta);
      this.mensagemSucesso = 'Participante cadastrado com sucesso!';
      this.participatenCadastradoOutput.emit();
      this.enviando = false
      this.participanteForm.reset();
      setTimeout(() => {
        this.mensagemSucesso = ''
      }, 2000);
    },
    error: erro => {
      console.log("Erro ao cadastrar", erro)
      this.enviando = false
      this.mensagemErro = erro.error?.titulo ?? 'Erro ao cadastrar participante.';
      setTimeout(() => {
        this.mensagemErro = ''
      }, 2000);
    }
  });
  }
}
