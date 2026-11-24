import { Component, Input } from '@angular/core';

export type TipoAviso = 'sucesso' | 'erro' | 'info';

// Mensagem de feedback com ícone (nunca depende só da cor). Usado em toasts e dentro de cards.
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
      default:
        return 'border-navy-soft bg-navy-tint text-codiub-navy';
    }
  }
}
