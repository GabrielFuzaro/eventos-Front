import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { Evento, paraInputDataHora, statusEvento } from 'src/app/models/evento';

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
    private router: Router
  ) {}

  id!: number;
  evento?: Evento;
  categorias: Categoria[] = [];
  statusEvento = statusEvento;

  carregando = true;
  eventoNaoEncontrado = false;
  enviando = false;

  mensagemSucesso = '';
  mensagemErro = '';

  eventoFormularioEdicao = new FormGroup({
    nome: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    capacidade_maxima: new FormControl<number | null>(null, [Validators.min(1), Validators.required]),
    data_evento: new FormControl<string | null>(null, Validators.required),
    categoriaId: new FormControl<number | null>(null, Validators.required)
  })

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoriaService.listarCategorias().subscribe({
      next: categorias => this.categorias = categorias,
      error: () => this.mostrarErro('Não foi possível carregar as categorias.')
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
            data_evento: paraInputDataHora(evento.data_evento), // datetime-local não aceita fuso
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

  onSubmit() {
    const eventosEdicao = {
      nome: this.eventoFormularioEdicao.value.nome!,
      local: this.eventoFormularioEdicao.value.local!,
      capacidade_maxima: this.eventoFormularioEdicao.value.capacidade_maxima!,
      data_evento: this.eventoFormularioEdicao.value.data_evento! + ':00-03:00',
      categoriaId: this.eventoFormularioEdicao.value.categoriaId!
    }

    this.mensagemErro = '';
    this.enviando = true;

    this.eventoService.atualizarEvento(this.id, eventosEdicao)
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Alterações salvas';
          // Volta para os detalhes: a API pode ter recalculado o status ou chamado a lista de espera
          setTimeout(() => this.router.navigate(['/eventos', this.id]), 1200);
        },
        error: erro => {
          this.enviando = false;
          this.mostrarErro(erro.error?.titulo ?? 'Não foi possível salvar as alterações. Verifique os campos e tente novamente.');
        }
      })
  }

  private mostrarErro(mensagem: string) {
    this.mensagemErro = mensagem;
    setTimeout(() => this.mensagemErro = '', 3500);
  }
}
