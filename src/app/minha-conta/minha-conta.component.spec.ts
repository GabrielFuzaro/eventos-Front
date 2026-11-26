import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';
import { MinhaContaComponent } from './minha-conta.component';

describe('MinhaContaComponent', () => {
  let component: MinhaContaComponent;
  let fixture: ComponentFixture<MinhaContaComponent>;
  let authService: AuthService;
  let notifier: NotifierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [MinhaContaComponent]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    notifier = TestBed.inject(NotifierService);
    spyOn(authService, 'getUsername').and.returnValue('maria.souza');
    spyOn(authService, 'getRole').and.returnValue('ADMIN');
    spyOn(authService, 'isAdmin').and.returnValue(true);

    fixture = TestBed.createComponent(MinhaContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve exibir dados do usuário logado e perfil Administrador', () => {
    expect(component.nomeUsuario).toBe('maria.souza');
    expect(component.rotuloPerfil).toBe('Administrador');
    expect(component.siglaPerfil).toBe('ADMIN');
  });

  it('deve validar divergência entre nova senha e confirmação', () => {
    component.senhaForm.patchValue({
      senhaAtual: 'senhaAtual123',
      novaSenha: 'novaSenha123',
      confirmarSenha: 'diferente123'
    });
    component.senhaForm.controls.confirmarSenha.markAsTouched();

    expect(component.senhaForm.hasError('senhasDivergentes')).toBeTrue();
    expect(component.confirmacaoDivergente).toBeTrue();
  });

  it('deve chamar authService.alterarSenha e notificar sucesso quando formulário estiver válido', () => {
    const spyAlterar = spyOn(authService, 'alterarSenha').and.returnValue(of(void 0));
    const spySucesso = spyOn(notifier, 'sucesso');

    component.senhaForm.setValue({
      senhaAtual: 'senhaAtual123',
      novaSenha: 'novaSenha456',
      confirmarSenha: 'novaSenha456'
    });

    component.alterarSenha();

    expect(spyAlterar).toHaveBeenCalledWith('senhaAtual123', 'novaSenha456');
    expect(spySucesso).toHaveBeenCalledWith('Senha alterada com sucesso');
    expect(component.enviando).toBeFalse();
  });
});
