import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEventosComponent } from './detalhes-eventos.component';

describe('DetalhesEventosComponent', () => {
  let component: DetalhesEventosComponent;
  let fixture: ComponentFixture<DetalhesEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesEventosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
