import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipanteService } from '../../services/participante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent {

  constructor(private participanteService: ParticipanteService, private route: ActivatedRoute, private router: Router) {}

  mensagemErro: string = '';
  mensagemSucesso: string ='';

  ngOnInit(){
    this.route.snapshot.paramMap.get("id")
  }
  participante = {
    nome: '',
    email: '',
    eventoId: {
      id: this.route.snapshot.paramMap.get("id")
    }
  }

  salvar() {
    console.log("salvou")
  }

  cadastrarParticipante(){
    this.participanteService.cadastrarParticipante(this.participante)
    .subscribe({
      next: resposta => {
        console.log("Cadastrado com suceseso", resposta);
        this.mensagemErro = '';
        this.mensagemSucesso = 'Participante cadastrado com sucesso!';
      },
      error: erro => {
        console.log(erro);
        console.log("BODY DO ERRO:", erro.error);
        this.mensagemErro = erro.error.titulo;
      }
    });
  }
}
