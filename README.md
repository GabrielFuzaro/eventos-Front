# Gestão de Eventos — Front-end (Prefeitura de Uberaba · CODIUB)

Interface web desenvolvida em **Angular 15** e **Tailwind CSS 3**, padronizada com o **Design System CODIUB (Modo Prefeitura)** e diretrizes corporativas de engenharia de software, para gerenciamento de eventos municipais, inscrições de participantes e lista de espera automática em integração direta com a [Eventos API](https://github.com/GabrielFuzaro/eventos-API).

---

## Funcionalidades

- **Duas Faces Institucionais (Modo Prefeitura):**
  - **Área Administrativa / CMS (`ADMIN`):** navbar navy (`#042D62`) com brasão colorido da Prefeitura + texto branco (`pmu-colorida-texto-branco-horizontal.png`), sidebar clara recolhível no desktop (`GE` + botão `☰`) com acesso direto a **Eventos**, **Minha conta** e **Portal da Prefeitura**, além de painel agrupado com **5 indicadores dinâmicos** filtráveis por **Data inicial**, **Data final** e **Categoria**.
  - **Área Pública / Cidadão (`USER`, Login e Cadastro):** barra superior branca com `pmu-colorida-horizontal.png` + faixa navy `"Eventos"` alinhados ao grid `max-w-6xl`, breadcrumb `Portal da Prefeitura › FacilitaTudo › Início` e barra única de filtros com controles grandes (`48px`).
- **Listagem Avançada, Ordenação e Exportação Excel:**
  - Tabela responsiva (colunas ordenáveis com `aria-sort` no desktop e blocos rotulados abaixo de `md`), paginação corporativa **5 / 10 / 20 itens por página**, seletor de ocultação de colunas e **exportação para Excel** (`GET /eventos/excel`) respeitando os filtros ativos e as colunas visíveis.
- **Notificações Globais (`NotifierService` + `NotifierComponent`):**
  - Toasts centralizados de `3s` no canto superior direito com pausa automática no hover/foco e contraste WCAG AA para `sucesso`, `erro`, `aviso` e `info`.
- **Minha Conta e Alteração de Senha (`/minha-conta`):**
  - Consulta dos dados da sessão, perfil de acesso e alteração segura de senha integrada ao endpoint `PUT /auth/alterar-senha`.
- **Detalhes, Inscrição e Localização:**
  - Painel de ocupação em tempo real, lista de espera automática, exportação de participantes em Excel e **modal de rota integrado com Google Maps e Waze**.
- **Acessibilidade Governamental (WCAG AA + VLibras):**
  - Widget oficial **VLibras**, foco gerenciado em modais/diálogos (`role="alertdialog"`), página `404` padronizada e suporte a `prefers-reduced-motion`.

---

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | Angular 15 (NgModule) |
| Linguagem | TypeScript 4.9 (`strict` + `strictTemplates`) |
| Estilização | Tailwind CSS 3 + Preset Oficial `codiub-design` |
| Formulários | Angular Reactive Forms |
| HTTP & Segurança | Angular HttpClient + Cookie `HttpOnly` (`withCredentials`) |
| Testes | Jasmine + Karma (`ChromeHeadless`) |
| CI/CD | GitHub Actions (build e testes automatizados) |

---

## Arquitetura e Organização

```text
src/
├── app/
│   ├── compartilhado/
│   │   ├── aviso/                     # Alerta inline acessível (sucesso, erro, aviso, info)
│   │   ├── modal-rota/                # Modal de localização e rota (Google Maps e Waze)
│   │   ├── notifier/                  # Container global de Toasts CODIUB (3s, WCAG AA)
│   │   └── pagina-nao-encontrada/     # Tela 404 padronizada
│   ├── eventos/                       # Dashboard, filtros, ordenação, Excel e formulários
│   ├── detalhes-eventos/              # Ocupação, metadados, Excel de inscritos e rota
│   ├── minha-conta/                   # Dados da sessão e formulário de alteração de senha
│   ├── participantes/                 # Inscrição, listagem paginada e fila de espera
│   ├── login/ & cadastro/             # Autenticação com co-branding Prefeitura/CODIUB
│   ├── guards/ & interceptors/        # Proteção de rotas e interceptor HttpOnly/401
│   ├── models/                        # Contratos TypeScript e paginação 5/10/20
│   └── services/                      # Serviços HTTP e NotifierService global
├── assets/
│   ├── icons/                         # Ícones institucionais e de GPS (Google Maps, Waze, Home)
│   └── logo/                          # Logos oficiais CODIUB e Prefeitura de Uberaba
└── environments/                      # Configuração separada entre desenvolvimento e produção
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
- [Eventos API](https://github.com/GabrielFuzaro/eventos-API) e MySQL em execução localmente em `http://localhost:8080`

### Comandos

```bash
# Instalar dependências exatas do lockfile
npm ci

# Servidor de desenvolvimento (http://localhost:4200)
npm start

# Build de produção
npx ng build

# Testes unitários
npx ng test --watch=false --browsers=ChromeHeadless
```

---

## Autor

**Gabriel Fuzaro** — [GitHub](https://github.com/GabrielFuzaro)
