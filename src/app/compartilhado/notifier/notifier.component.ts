import { Component } from '@angular/core';
import { NotificacaoToast, NotifierService, TipoNotificacao } from 'src/app/services/notifier.service';

// Container global de Toasts CODIUB (components.md §13 & tokens.md §5, §8, §11, §12):
// - Posição: canto superior direito no desktop, topo centralizado no celular
// - Geometria: rounded-lg (8px), shadow-lg, largura 360px no desktop (max-w-sm no celular), min-h-[48px], px-4 py-3
// - Tipografia: Open Sans text-sm (14px) font-medium leading-5
// - Ícones: SVG de traço 20x20 (h-5 w-5, stroke-width="2")
// - Cores WCAG AA:
//     sucesso -> bg-green-50, border-green-200 + faixa green-700, text-green-700
//     erro    -> bg-red-50, border-red-600 + faixa red-600, text-red-700 (ícone red-600)
//     aviso   -> bg-amber-50, border-amber-300 + faixa amber-600, text-amber-800 (ícone amber-700)
//     info    -> bg-blue-50, border-blue-300 + faixa codiub-brand, text-codiub-ink (ícone blue-600)
@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html'
})
export class NotifierComponent {

  readonly notificacoes$ = this.notifier.notificacoes$;

  constructor(public notifier: NotifierService) {}

  rastrearPorId(_indice: number, item: NotificacaoToast): number {
    return item.id;
  }

  classesCard(tipo: TipoNotificacao): string {
    switch (tipo) {
      case 'sucesso':
        return 'border-green-200 border-l-green-700 bg-green-50 text-green-700';
      case 'erro':
        return 'border-red-600 border-l-red-600 bg-red-50 text-red-700';
      case 'aviso':
        return 'border-amber-300 border-l-amber-600 bg-amber-50 text-amber-800';
      case 'info':
      default:
        return 'border-blue-300 border-l-codiub-brand bg-blue-50 text-codiub-ink';
    }
  }

  classesIcone(tipo: TipoNotificacao): string {
    switch (tipo) {
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

  classesBotaoFechar(tipo: TipoNotificacao): string {
    switch (tipo) {
      case 'sucesso':
        return 'text-green-700 hover:bg-green-100 focus-visible:ring-green-700';
      case 'erro':
        return 'text-red-700 hover:bg-red-100 focus-visible:ring-red-600';
      case 'aviso':
        return 'text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-600';
      case 'info':
      default:
        return 'text-codiub-ink hover:bg-blue-100 focus-visible:ring-blue-600';
    }
  }
}
