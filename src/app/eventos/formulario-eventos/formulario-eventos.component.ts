import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';
import { Output, EventEmitter } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';
import { firstValueFrom } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-formulario-eventos',
  templateUrl: './formulario-eventos.component.html',
  styleUrls: ['./formulario-eventos.component.css']
})
export class FormularioEventosComponent implements OnInit {

  constructor(private eventoService: EventoService, private categoriaService: CategoriaService) {}

  @Output() eventoCadastradoOutput = new EventEmitter<void>();
  @Output() fecharOutput = new EventEmitter<void>();

  mensagemErro: string = '';
  categorias: Categoria[] = [];

  eventoFormulario = new FormGroup({
    nome: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    capacidade_maxima: new FormControl(null, [Validators.required, Validators.min(1)]),
    data_evento: new FormControl(null, Validators.required),
    categoriaId: new FormControl(null, Validators.required)
  })

  enviando: boolean = false

  ngOnInit(): void{
    this.listarCategorias();
  }

  invalido(campo: string): boolean {
    const controle = this.eventoFormulario.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  onSubmit(){
    const evento = {
      nome: this.eventoFormulario.value.nome!,
      local: this.eventoFormulario.value.local!,
      capacidade_maxima: this.eventoFormulario.value.capacidade_maxima!,
      data_evento: this.eventoFormulario.value.data_evento! + ':00-03:00',
      categoriaId: this.eventoFormulario.value.categoriaId!
    };

    this.mensagemErro = '';
    this.enviando = true

    this.eventoService.cadastrarEvento(evento)
    .subscribe({
      next: () => {
        // A página de eventos fecha o modal e mostra a mensagem de sucesso
        this.enviando = false
        this.eventoFormulario.reset();
        this.eventoCadastradoOutput.emit()
      },
      error: erro => {
        this.enviando = false
        this.mensagemErro = erro.error?.titulo ?? 'Erro ao cadastrar evento.';
        setTimeout(() => {
          this.mensagemErro = ''
        }, 3000);
      }
    })
  }

  async listarCategorias(){
      try {
        const response = await firstValueFrom(this.categoriaService.listarCategorias());
        this.categorias = response;
      } catch (error) {
        this.mensagemErro = "Erro ao listar categorias.";
        setTimeout(() => {
          this.mensagemErro = "";
        }, 2000);
      }
  }

}
