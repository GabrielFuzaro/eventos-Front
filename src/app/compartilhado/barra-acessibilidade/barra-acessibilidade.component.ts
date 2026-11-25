import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

const CHAVE_PREFERENCIAS = 'codiub_a11y_prefs';

interface PreferenciasAcessibilidade {
  escalaFonte: number;
  altoContraste: boolean;
  semAnimacao: boolean;
}

@Component({
  selector: 'app-barra-acessibilidade',
  templateUrl: './barra-acessibilidade.component.html'
})
export class BarraAcessibilidadeComponent implements OnInit {
  aberto = false;
  escalaFonte = 100;
  altoContraste = false;
  semAnimacao = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.carregarPreferencias();
  }

  alternarPainel(): void {
    this.aberto = !this.aberto;
  }

  aumentarFonte(): void {
    if (this.escalaFonte < 125) {
      this.escalaFonte = Math.min(this.escalaFonte + 12.5, 125);
      this.aplicarESalvar();
    }
  }

  diminuirFonte(): void {
    if (this.escalaFonte > 87.5) {
      this.escalaFonte = Math.max(this.escalaFonte - 12.5, 87.5);
      this.aplicarESalvar();
    }
  }

  alternarContraste(): void {
    this.altoContraste = !this.altoContraste;
    this.aplicarESalvar();
  }

  alternarAnimacoes(): void {
    this.semAnimacao = !this.semAnimacao;
    this.aplicarESalvar();
  }

  resetar(): void {
    this.escalaFonte = 100;
    this.altoContraste = false;
    this.semAnimacao = false;
    try {
      localStorage.removeItem(CHAVE_PREFERENCIAS);
    } catch {
      // Ignora bloqueio de storage do navegador
    }
    this.aplicarNoDocumento();
  }

  @HostListener('document:keydown.escape')
  fecharComEsc(): void {
    this.aberto = false;
  }

  @HostListener('document:click', ['$event'])
  fecharAoClicarFora(evento: MouseEvent): void {
    if (this.aberto && evento.target instanceof Node && !this.elementRef.nativeElement.contains(evento.target)) {
      this.aberto = false;
    }
  }

  private carregarPreferencias(): void {
    try {
      const salvo = localStorage.getItem(CHAVE_PREFERENCIAS);
      if (salvo) {
        const prefs = JSON.parse(salvo) as Partial<PreferenciasAcessibilidade>;
        if (typeof prefs.escalaFonte === 'number' && prefs.escalaFonte >= 87.5 && prefs.escalaFonte <= 125) {
          this.escalaFonte = prefs.escalaFonte;
        }
        this.altoContraste = !!prefs.altoContraste;
        this.semAnimacao = !!prefs.semAnimacao;
      }
    } catch {
      // Usa valores padrão caso o JSON salvo seja inválido
    }
    this.aplicarNoDocumento();
  }

  private aplicarESalvar(): void {
    this.aplicarNoDocumento();
    try {
      const prefs: PreferenciasAcessibilidade = {
        escalaFonte: this.escalaFonte,
        altoContraste: this.altoContraste,
        semAnimacao: this.semAnimacao
      };
      localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(prefs));
    } catch {
      // Ignora bloqueio de storage do navegador
    }
  }

  private aplicarNoDocumento(): void {
    const raiz = document.documentElement;
    raiz.style.fontSize = `${this.escalaFonte}%`;
    raiz.classList.toggle('a11y-contraste', this.altoContraste);
    raiz.classList.toggle('a11y-sem-animacao', this.semAnimacao);
  }
}
