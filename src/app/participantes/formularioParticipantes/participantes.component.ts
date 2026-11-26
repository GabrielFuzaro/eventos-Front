import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipanteInput } from 'src/app/models/participante';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { ParticipanteService } from '../../services/participante.service';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent {

  constructor(
    private participanteService: ParticipanteService,
    private listaEsperaService: ListaEsperaService,
    private notifier: NotifierService
  ) {}

  enviando = false;

  @Input() eventoId!: number;
  @Input() statusEvento!: string;
  @Output() participanteCadastradoOutput = new EventEmitter<void>();

  participanteForm = new FormGroup({
    // Mesmos limites da API: nome até 30 e email até 40 caracteres
    nome: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
  });

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

  onSubmit(): void {
    if (this.participanteForm.invalid || this.encerrado) {
      this.participanteForm.markAllAsTouched();
      return;
    }

    const participante: ParticipanteInput = {
      nome: this.participanteForm.value.nome!,
      email: this.participanteForm.value.email!,
      eventoId: {
        id: this.eventoId
      }
    };

    this.enviando = true;

    if (this.modoListaEspera) {
      this.entrarNaListaDeEspera(participante);
      return;
    }

    this.participanteService.cadastrarParticipante(participante)
      .subscribe({
        next: () => {
          this.notifier.sucesso('Participante inscrito');
          this.participanteCadastradoOutput.emit();
          this.enviando = false;
          this.participanteForm.reset();
        },
        error: erro => {
          this.enviando = false;
          this.notifier.erroApi(erro, 'Não foi possível fazer a inscrição. Tente novamente.');
          this.participanteCadastradoOutput.emit(); // Recarrega o evento: ele pode ter acabado de lotar
        }
      });
  }

  entrarNaListaDeEspera(inscricao: ParticipanteInput): void {
    this.listaEsperaService.entrar(inscricao)
      .subscribe({
        next: resposta => {
          this.notifier.sucesso(`Inscrição feita na lista de espera (${resposta.posicao}º lugar)`);
          this.participanteCadastradoOutput.emit();
          this.enviando = false;
          this.participanteForm.reset();
        },
        error: erro => {
          this.enviando = false;
          this.notifier.erroApi(erro, 'Não foi possível entrar na lista de espera. Tente novamente.');
          this.participanteCadastradoOutput.emit(); // Recarrega o evento: pode ter aberto uma vaga
        }
      });
  }
}
