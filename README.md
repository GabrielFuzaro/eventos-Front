# Gestão de Eventos — Front-end (Prefeitura de Uberaba · CODIUB)

Interface web desenvolvida em **Angular 15** e **Tailwind CSS 3**, padronizada com o **Design System CODIUB no Modo Prefeitura**, para gerenciamento de eventos municipais, inscrições de participantes e lista de espera automática, consumindo a [Eventos API](https://github.com/GabrielFuzaro/eventos-API).

---

## Funcionalidades

- **Identidade Institucional Municipal (Modo Prefeitura):** cabeçalho com marca oficial da Prefeitura de Uberaba em versão branca sobre superfície navy (`#042D62`), assinatura tecnológica CODIUB no rodapé e breadcrumb integrado ao Portal da Prefeitura.
- **Acessibilidade Governamental (WCAG AA + eMAG):** barra de ferramentas de acessibilidade (`A+`, `A-`, modo **Alto Contraste** `#000000`/`#FFFFFF`/`#FFFF00`, desativação de animações e reset persistidos em `localStorage`), navegação por teclado, diálogos acessíveis (`role="alertdialog"`) e integração com o widget **VLibras**.
- **Listagem de eventos** responsiva (tabela no desktop e blocos rotulados abaixo de `md`), com indicadores de status, busca com *debounce*, filtro por período/status, seletor de ocultação de colunas e distinção clara entre estado carregando, vazio e erro.
- **Cadastro e edição de eventos** com *Reactive Forms* e validação de campos.
- **Detalhes do evento e localização:** painel de ocupação em tempo real, exportação de participantes em Excel e **modal de rota integrado com Google Maps e Waze**.
- **Inscrição e lista de espera automática:** bloqueio automático para eventos encerrados e transição automática para fila de espera quando o evento atinge a capacidade máxima.
- **Página 404 padronizada** para rotas inexistentes.

---

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | Angular 15 (NgModule) |
| Linguagem | TypeScript 4.9 (`strict` + `strictTemplates`) |
| Estilização | Tailwind CSS 3 + Preset Oficial `codiub-design` |
| Formulários | Angular Reactive Forms |
| HTTP & Segurança | Angular HttpClient + Cookie `HttpOnly` (`withCredentials`) |
| Testes | Jasmine + Karma |

---

## Arquitetura e Organização

```text
src/
├── app/
│   ├── compartilhado/
│   │   ├── aviso/                     # Feedback visual acessível (sucesso, erro, info)
│   │   ├── barra-acessibilidade/      # Painel A+, A-, Alto Contraste e Redução de Movimento
│   │   ├── modal-rota/                # Modal de localização e rota (Google Maps e Waze)
│   │   └── pagina-nao-encontrada/     # Tela 404 padronizada
│   ├── eventos/                       # Listagem, indicadores, criação e edição de eventos
│   ├── detalhes-eventos/              # Ocupação, metadados, Excel e gestão de inscritos
│   ├── participantes/                 # Formulário de inscrição, lista de participantes e lista de espera
│   ├── login/ & cadastro/             # Autenticação com Reactive Forms e co-branding Prefeitura/CODIUB
│   ├── guards/ & interceptors/        # Proteção de rotas e envio seguro do cookie HttpOnly
│   ├── models/                        # Contratos TypeScript e helpers de domínio
│   └── services/                      # Comunicação HTTP centralizada por recurso
├── assets/
│   ├── icons/                         # Ícones institucionais e de navegação (Google Maps, Waze, Home)
│   └── logo/                          # Logos oficiais CODIUB e Prefeitura de Uberaba (recorte 4%)
└── environments/                      # Configuração de API separada entre desenvolvimento e produção
```

---

## Configuração de Ambientes

As URLs da API ficam centralizadas em `src/environments/`:

- **Desenvolvimento (`src/environments/environment.ts`):** `http://localhost:8080`
- **Produção (`src/environments/environment.prod.ts`):** substituído automaticamente no build `production` via `fileReplacements` em `angular.json`.

---

## Como Executar e Validar

### Pré-requisitos
- Node.js 18+ e npm
- [Eventos API](https://github.com/GabrielFuzaro/eventos-API) em execução em `http://localhost:8080`

### Comandos

```bash
# Instalar dependências exatas do lockfile
npm ci

# Servidor de desenvolvimento (http://localhost:4200)
npm start

# Build de produção (validação de tipos, templates e orçamentos de bundle)
npx ng build

# Testes unitários
npx ng test --watch=false --browsers=ChromeHeadless
```

---

## Autor

**Gabriel Fuzaro** — [GitHub](https://github.com/GabrielFuzaro)
