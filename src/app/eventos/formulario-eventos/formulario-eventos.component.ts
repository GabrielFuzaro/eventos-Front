import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-formulario-eventos',
  templateUrl: './formulario-eventos.component.html',
  styleUrls: ['./formulario-eventos.component.css']
})
export class FormularioEventosComponent {

  constructor(private eventoService: EventoService, private route: ActivatedRoute, private router: Router) {}

 @Output() eventoCadastradoOutput = new EventEmitter<void>();

  mensagemErro: string = '';
  mensagemSucesso: string ='';

  eventoFormulario = new FormGroup({
    nome: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    capacidade_maxima: new FormControl(null, [Validators.required, Validators.min(1)]),
    data_evento: new FormControl(null, Validators.required)
  })

  enviando: boolean = false

  onSubmit(){
    const evento = {
      nome: this.eventoFormulario.value.nome!,
      local: this.eventoFormulario.value.local!,
      capacidade_maxima: this.eventoFormulario.value.capacidade_maxima!,
      data_evento: this.eventoFormulario.value.data_evento! + ':00-03:00'
    };
    
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.enviando = true

    this.eventoService.cadastrarEvento(evento)
    .subscribe({ 
      next: resposta => {
        console.log("Evento cadastrado")
        this.mensagemSucesso = "Evento cadastrado com sucesso!"
        this.eventoCadastradoOutput.emit()
        this.enviando = false
        this.eventoFormulario.reset();
        setTimeout(() => {
          this.mensagemSucesso = ''
        }, 3000);
      },
      error: erro => {
        console.log("Erro ao cadastrar", erro)
        this.enviando = false
        this.mensagemErro = erro.error?.titulo ?? 'Erro ao cadastrar evento.';
        setTimeout(() => {
          this.mensagemErro = ''
        }, 3000);
      }
    })
  }

}
