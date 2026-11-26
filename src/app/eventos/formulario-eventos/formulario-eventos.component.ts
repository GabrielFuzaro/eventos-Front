import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';
import { agoraInputDataHora } from 'src/app/models/evento';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EventoService } from 'src/app/services/evento.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-formulario-eventos',
  templateUrl: './formulario-eventos.component.html',
  styleUrls: ['./formulario-eventos.component.css']
})
export class FormularioEventosComponent implements OnInit {

  constructor(
    private eventoService: EventoService,
    private categoriaService: CategoriaService,
    private notifier: NotifierService
  ) {}

  @Output() eventoCadastradoOutput = new EventEmitter<void>();
  @Output() fecharOutput = new EventEmitter<void>();

  categorias: Categoria[] = [];
  enviando = false;
  dataMinima = agoraInputDataHora(); // A API não aceita data no passado

  eventoFormulario = new FormGroup({
    nome: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    capacidade_maxima: new FormControl(null, [Validators.required, Validators.min(1)]),
    data_evento: new FormControl(null, Validators.required),
    categoriaId: new FormControl(null, Validators.required)
  });

  ngOnInit(): void {
    this.listarCategorias();
  }

  invalido(campo: string): boolean {
    const controle = this.eventoFormulario.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  onSubmit(): void {
    if (this.eventoFormulario.invalid) {
      this.eventoFormulario.markAllAsTouched();
      return;
    }

    const evento = {
      nome: this.eventoFormulario.value.nome!,
      local: this.eventoFormulario.value.local!,
      capacidade_maxima: this.eventoFormulario.value.capacidade_maxima!,
      data_evento: this.eventoFormulario.value.data_evento! + ':00-03:00',
      categoriaId: this.eventoFormulario.value.categoriaId!
    };

    this.enviando = true;

    this.eventoService.cadastrarEvento(evento)
      .subscribe({
        next: () => {
          // A página de eventos fecha o modal e dispara a notificação de sucesso
          this.enviando = false;
          this.eventoFormulario.reset();
          this.eventoCadastradoOutput.emit();
        },
        error: erro => {
          this.enviando = false;
          this.notifier.erroApi(erro, 'Não foi possível cadastrar o evento. Tente novamente.');
        }
      });
  }

  async listarCategorias(): Promise<void> {
    try {
      this.categorias = await firstValueFrom(this.categoriaService.listarCategorias());
    } catch {
      this.notifier.erro('Não foi possível carregar as categorias');
    }
  }
}
