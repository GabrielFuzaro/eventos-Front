import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ParticipantesComponent } from './participantes.component';
import { AvisoComponent } from 'src/app/compartilhado/aviso/aviso.component';

describe('ParticipantesComponent', () => {
  let component: ParticipantesComponent;
  let fixture: ComponentFixture<ParticipantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        ParticipantesComponent,
        AvisoComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantesComponent);
    component = fixture.componentInstance;
    component.eventoId = 1;
    component.statusEvento = 'ABERTO';
    fixture.detectChanges();
  });

  it('deve criar o componente com formulário inicialmente inválido', () => {
    expect(component).toBeTruthy();
    expect(component.participanteForm.invalid).toBeTrue();
  });

  it('deve ativar modoListaEspera quando o status do evento for LOTADO', () => {
    component.statusEvento = 'LOTADO';
    expect(component.modoListaEspera).toBeTrue();
    expect(component.encerrado).toBeFalse();
  });

  it('deve marcar encerrado quando o status do evento for ENCERRADO', () => {
    component.statusEvento = 'ENCERRADO';
    expect(component.encerrado).toBeTrue();
  });
});
