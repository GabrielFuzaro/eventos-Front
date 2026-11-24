// CODIUB — preset Tailwind (Tailwind 3.x)
// Sincronizar com references/tokens.md.
//
// Uso no projeto:
//   // tailwind.config.js
//   module.exports = {
//     presets: [require('./tailwind.preset.js')],
//     content: ['./src/**/*.{html,ts,tsx,vue}'],
//   }
//
// Mantém as escalas padrão do Tailwind (gray, blue, green, red…) e só ACRESCENTA
// as cores de marca e os valores próprios.
module.exports = {
  theme: {
    extend: {
      colors: {
        codiub: {
          brand: '#002069',          // logo, títulos, botão primário, item ativo
          'brand-hover': '#0035AF',
          'brand-active': '#021D40',
          navy: '#042D62',           // superfícies: navbar, footer, barras de seção (nunca botão)
          ink: '#14263D',            // texto forte
          indigo: '#4862C3',         // acento de gráficos e gradientes
          muted: '#5B708F',          // rótulo de KPI
          cyan: '#00BEF2',           // acento decorativo: bordas, divisores, setas (texto só sobre navy)
          page: '#F3F3F3',           // fundo de página de portal
          tile: '#EEEEEE',           // tile de serviço
          sidebar: '#FAFAFA',
          th: '#F8F8F8',
          zebra: '#F2F2F2',
          disabled: '#F0F0F0',
          'panel-bg': '#FBFCFF',
          'row-bg': '#F8FBFF',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em', fontWeight: '700' }],
        'section-label': ['0.72rem', { lineHeight: '1rem', letterSpacing: '0.18em', fontWeight: '600' }],
        micro: ['11px', { lineHeight: '14px' }],
      },
      borderRadius: {
        panel: '16px',
      },
      borderColor: {
        'navy-soft': 'rgba(4, 45, 98, 0.12)',
        'navy-strong': 'rgba(4, 45, 98, 0.22)',
      },
      backgroundColor: {
        'navy-tint': 'rgba(4, 45, 98, 0.08)',
        'navy-hover-tint': 'rgba(4, 45, 98, 0.06)',
      },
      backgroundImage: {
        'codiub-bar': 'linear-gradient(90deg, #042D62 0%, #4862C3 100%)',
      },
      width: {
        sidebar: '78px',
        'sidebar-open': '250px',
      },
      height: {
        control: '42px',             // botões e campos
        'control-lg': '48px',        // botão e select grandes (barra de filtros)
      },
      minHeight: {
        control: '42px',
        'control-lg': '48px',
      },
    },
  },
};
