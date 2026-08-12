import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { ActivatedRoute } from '@angular/router';
import { Evento } from 'src/app/models/evento';

@Component({
  selector: 'app-formulario-edicao-eventos',
  templateUrl: './formulario-edicao-eventos.component.html',
  styleUrls: ['./formulario-edicao-eventos.component.css']
})
export class FormularioEdicaoEventosComponent implements OnInit{

  constructor(private eventoService: EventoService, private route: ActivatedRoute) {}
    
    id!: number;
    evento!: Evento;

    mensagemSucesso = '';
    mensagemErro = '';

    ngOnInit(): void {
      this.id = Number(this.route.snapshot.paramMap.get('id'));

      this.eventoService.buscarPorId(this.id)
      .subscribe(evento => {
        this.eventoFormularioEdicao.patchValue({
          nome: evento.nome,
          local: evento.local,
          capacidade_maxima: evento.capacidade_maxima,
          data_evento: evento.data_evento
        });
      });
    }

  eventoFormularioEdicao = new FormGroup({
    nome: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    capacidade_maxima: new FormControl<number | null>(null, [Validators.min(1), Validators.required]),
    data_evento: new FormControl<string | null>(null, Validators.required)
  })
  
  onSubmit(){

    const eventosEdicao = {
      nome: this.eventoFormularioEdicao.value.nome!,
      local: this.eventoFormularioEdicao.value.local!,
      capacidade_maxima: this.eventoFormularioEdicao.value.capacidade_maxima!,
      data_evento: this.eventoFormularioEdicao.value.data_evento! + ':00-03:00'
    }

    this.eventoService.atualizarEvento(this.id, eventosEdicao)
    .subscribe({
      next: resultado => {
        console.log("formulario atualizado", resultado);
        this.mensagemSucesso = "Evento atualizado com sucesso.";
        this.eventoFormularioEdicao.reset
      },
      error: erro => {
        console.log("Erro ao atualizar evento", erro);
        this.mensagemErro = erro.error?.titulo ?? "Erro ao atualizar evento. Verifique todos os campos e tente novamente";
        setTimeout(() => {
          this.mensagemErro = ''
        }, 3000)
      }
    })
  }
}
