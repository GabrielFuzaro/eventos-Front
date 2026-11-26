import { Component, Input } from '@angular/core';

export type TipoAviso = 'sucesso' | 'erro' | 'aviso' | 'info';

// Alerta contextual inline com ícone semântico (tokens.md §5 & components.md §18).
@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html'
})
export class AvisoComponent {
  @Input() tipo: TipoAviso = 'info';
  @Input() mensagem = '';

  get classes(): string {
    switch (this.tipo) {
      case 'sucesso':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'erro':
        return 'border-red-600 bg-red-50 text-red-700';
      case 'aviso':
        return 'border-amber-300 bg-amber-50 text-amber-800';
      case 'info':
      default:
        return 'border-blue-300 bg-blue-50 text-codiub-ink';
    }
  }

  get classesIcone(): string {
    switch (this.tipo) {
      case 'sucesso':
        return 'text-green-700';
      case 'erro':
        return 'text-red-600';
      case 'aviso':
        return 'text-amber-700';
      case 'info':
      default:
        return 'text-blue-600';
    }
  }
}
