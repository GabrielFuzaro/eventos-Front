import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEdicaoEventosComponent } from './formulario-edicao-eventos.component';

describe('FormularioEdicaoEventosComponent', () => {
  let component: FormularioEdicaoEventosComponent;
  let fixture: ComponentFixture<FormularioEdicaoEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioEdicaoEventosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEdicaoEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
