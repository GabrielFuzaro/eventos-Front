import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Evento, paraInputDataHora, statusEvento } from 'src/app/models/evento';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EventoService } from 'src/app/services/evento.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-formulario-edicao-eventos',
  templateUrl: './formulario-edicao-eventos.component.html',
  styleUrls: ['./formulario-edicao-eventos.component.css']
})
export class FormularioEdicaoEventosComponent implements OnInit {

  constructor(
    private eventoService: EventoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private notifier: NotifierService
  ) {}

  id!: number;
  evento?: Evento;
  categorias: Categoria[] = [];
  statusEvento = statusEvento;

  carregando = true;
  eventoNaoEncontrado = false;
  enviando = false;

  eventoFormularioEdicao = new FormGroup({
    nome: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    capacidade_maxima: new FormControl<number | null>(null, [Validators.min(1), Validators.required]),
    data_evento: new FormControl<string | null>(null, Validators.required),
    categoriaId: new FormControl<number | null>(null, Validators.required)
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoriaService.listarCategorias().subscribe({
      next: categorias => this.categorias = categorias,
      error: () => this.notifier.erro('Não foi possível carregar as categorias')
    });

    this.eventoService.buscarPorId(this.id)
      .subscribe({
        next: evento => {
          this.evento = evento;
          this.carregando = false;
          this.eventoFormularioEdicao.patchValue({
            nome: evento.nome,
            local: evento.local,
            capacidade_maxima: evento.capacidade_maxima,
            data_evento: paraInputDataHora(evento.data_evento),
            categoriaId: evento.categoriaId
          });
        },
        error: () => {
          this.carregando = false;
          this.eventoNaoEncontrado = true;
        }
      });
  }

  invalido(campo: string): boolean {
    const controle = this.eventoFormularioEdicao.get(campo);
    return !!controle && controle.invalid && controle.touched;
  }

  onSubmit(): void {
    if (this.eventoFormularioEdicao.invalid) {
      this.eventoFormularioEdicao.markAllAsTouched();
      return;
    }

    const eventosEdicao = {
      nome: this.eventoFormularioEdicao.value.nome!,
      local: this.eventoFormularioEdicao.value.local!,
      capacidade_maxima: this.eventoFormularioEdicao.value.capacidade_maxima!,
      data_evento: this.eventoFormularioEdicao.value.data_evento! + ':00-03:00',
      categoriaId: this.eventoFormularioEdicao.value.categoriaId!
    };

    this.enviando = true;

    this.eventoService.atualizarEvento(this.id, eventosEdicao)
      .subscribe({
        next: () => {
          this.notifier.sucesso('Alterações salvas');
          this.router.navigate(['/eventos', this.id]);
        },
        error: erro => {
          this.enviando = false;
          this.notifier.erroApi(erro, 'Não foi possível salvar as alterações. Verifique os campos e tente novamente.');
        }
      });
  }
}
