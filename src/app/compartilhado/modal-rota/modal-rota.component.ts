import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-rota',
  templateUrl: './modal-rota.component.html'
})
export class ModalRotaComponent {
  @Input() nome = '';
  @Input() local = '';
  @Input() dataEvento = '';
  @Output() fecharOutput = new EventEmitter<void>();

  @ViewChild('botaoFechar') set botaoFechar(botao: ElementRef<HTMLButtonElement> | undefined) {
    botao?.nativeElement.focus();
  }

  get urlGoogleMaps(): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.local)}`;
  }

  get urlWaze(): string {
    return `https://waze.com/ul?q=${encodeURIComponent(this.local)}&navigate=yes`;
  }

  @HostListener('document:keydown.escape')
  fecharComEsc(): void {
    this.fecharOutput.emit();
  }
}
