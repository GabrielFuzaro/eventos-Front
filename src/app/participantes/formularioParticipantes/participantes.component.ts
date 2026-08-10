import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipanteService } from '../../services/participante.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent {

  constructor(private participanteService: ParticipanteService, private route: ActivatedRoute, private router: Router) {}

  mensagemErro: string = '';
  mensagemSucesso: string ='';

  @Input() eventoId!: number;
  @Output() participatenCadastradoOutput = new EventEmitter<void>();

  ngOnInit(){
    this.route.snapshot.paramMap.get("id")
  }
  
  participanteForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]), 
  })

  onSubmit(){

    const participante = {
    nome: this.participanteForm.value.nome,
    email: this.participanteForm.value.email,
    eventoId: {
      id: this.eventoId
    }
  };

  this.mensagemErro = '';
  this.mensagemSucesso = '';

  console.log("Participante: ", participante);

  this.participanteService.cadastrarParticipante(participante)
  .subscribe({
    next: resposta => {
      console.log("Cadastrado com Sucesso", resposta);
      this.mensagemSucesso = 'Participante cadastrado com sucesso!';

      this.participatenCadastradoOutput.emit();
    },
    error: erro => {
      console.log("Erro ao cadastrar", erro)
      this.mensagemErro = erro.error?.titulo ?? 'Erro ao cadastrar participante.';
    }
  });
  }
}
