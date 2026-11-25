import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListaParticipantesComponent } from './lista-participantes.component';
import { AvisoComponent } from 'src/app/compartilhado/aviso/aviso.component';

describe('ListaParticipantesComponent', () => {
  let component: ListaParticipantesComponent;
  let fixture: ComponentFixture<ListaParticipantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        ListaParticipantesComponent,
        AvisoComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir e fechar o diálogo de confirmação de exclusão sem confirm nativo', () => {
    const mockParticipante = {
      id: 10,
      nome: 'Maria Souza',
      email: 'maria@uberaba.mg.gov.br',
      evento: {
        id: 1,
        nome: 'Seminário Municipal',
        local: 'Centro Administrativo',
        capacidade_maxima: 50,
        status: 'ABERTO',
        data_evento: '2026-12-01T14:00:00-03:00',
        categoriaId: 1
      }
    };

    component.excluirParticipante(mockParticipante);
    fixture.detectChanges();

    expect(component.participanteParaExcluir).toEqual(mockParticipante);
    const dialog = (fixture.nativeElement as HTMLElement).querySelector('[role="alertdialog"]');
    expect(dialog).toBeTruthy();

    component.fecharDialogo();
    fixture.detectChanges();
    expect(component.participanteParaExcluir).toBeNull();
  });
});
