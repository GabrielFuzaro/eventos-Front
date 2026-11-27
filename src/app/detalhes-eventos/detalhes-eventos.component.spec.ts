import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AvisoComponent } from '../compartilhado/aviso/aviso.component';
import { ModalRotaComponent } from '../compartilhado/modal-rota/modal-rota.component';
import { Evento } from '../models/evento';
import { ListaEsperaComponent } from '../participantes/lista-espera/lista-espera.component';
import { ListaParticipantesComponent } from '../participantes/lista-participantes/lista-participantes.component';
import { ParticipantesComponent } from '../participantes/formularioParticipantes/participantes.component';
import { AuthService } from '../services/auth.service';
import { EventoService } from '../services/evento.service';
import { ListaEsperaService } from '../services/lista-espera.service';
import { ParticipanteService } from '../services/participante.service';
import { DetalhesEventosComponent } from './detalhes-eventos.component';

describe('DetalhesEventosComponent', () => {
  let component: DetalhesEventosComponent;
  let fixture: ComponentFixture<DetalhesEventosComponent>;
  let authService: AuthService;
  let eventoService: EventoService;
  let participanteService: ParticipanteService;
  let listaEsperaService: ListaEsperaService;

  const eventoMock: Evento = {
    id: 42,
    nome: 'Fórum Municipal de Inovação',
    local: 'Centro Administrativo',
    capacidade_maxima: 100,
    status: 'ABERTO',
    data_evento: '2026-12-10T14:00:00-03:00',
    categoriaId: 1,
    categoriaNome: 'Tecnologia'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        DetalhesEventosComponent,
        ParticipantesComponent,
        ListaParticipantesComponent,
        ListaEsperaComponent,
        ModalRotaComponent,
        AvisoComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '42' })
            }
          }
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    eventoService = TestBed.inject(EventoService);
    participanteService = TestBed.inject(ParticipanteService);
    listaEsperaService = TestBed.inject(ListaEsperaService);

    spyOn(eventoService, 'buscarPorId').and.returnValue(of(eventoMock));
    spyOn(participanteService, 'contarParticipantes').and.returnValue(of(75));
    spyOn(participanteService, 'listarParticipantesEvento').and.returnValue(of({
      content: [],
      totalElements: 75,
      totalPages: 0,
      size: 10,
      number: 0,
      first: true,
      last: true
    }));
    spyOn(listaEsperaService, 'contar').and.returnValue(of(3));
    spyOn(listaEsperaService, 'listarDoEvento').and.returnValue(of({
      content: [],
      totalElements: 3,
      totalPages: 0,
      size: 5,
      number: 0,
      first: true,
      last: true
    }));
  });

  function criarComponente(admin: boolean): void {
    spyOn(authService, 'isAdmin').and.returnValue(admin);
    fixture = TestBed.createComponent(DetalhesEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('deve criar o componente e carregar evento, participantes e fila de espera', () => {
    criarComponente(false);

    expect(component).toBeTruthy();
    expect(component.id).toBe(42);
    expect(component.evento).toEqual(eventoMock);
    expect(component.quantidadeParticipantes).toBe(75);
    expect(component.quantidadeListaEspera).toBe(3);
  });

  it('deve calcular corretamente vagasRestantes e percentualOcupacao', () => {
    criarComponente(false);

    expect(component.vagasRestantes).toBe(25);
    expect(component.percentualOcupacao).toBe(75);
  });

  it('deve exibir o botão Voltar para eventos no padrão btn-secondary para usuário comum', () => {
    criarComponente(false);
    const el = fixture.nativeElement as HTMLElement;
    const botaoVoltar = el.querySelector('a.btn-secondary[href="/eventos"]') as HTMLAnchorElement | null;
    expect(botaoVoltar).toBeTruthy();
    expect(botaoVoltar?.textContent).toContain('Voltar para eventos');
  });

  it('deve exibir Gerar Excel e Editar evento apenas para perfil ADMIN mantendo Voltar para eventos', () => {
    criarComponente(true);
    const el = fixture.nativeElement as HTMLElement;

    const botaoVoltar = el.querySelector('a.btn-secondary[href="/eventos"]') as HTMLAnchorElement | null;
    const botaoEditar = el.querySelector('a.btn-primary') as HTMLAnchorElement | null;
    const botoesSecundarios = Array.from(el.querySelectorAll('button.btn-secondary')).map(b => b.textContent?.trim());

    expect(botaoVoltar?.textContent).toContain('Voltar para eventos');
    expect(botaoEditar?.textContent).toContain('Editar evento');
    expect(botoesSecundarios.some(texto => texto?.includes('Gerar Excel'))).toBeTrue();
  });
});
