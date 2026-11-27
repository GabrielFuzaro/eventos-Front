# CLAUDE.md — Eventos Front

Front-end Angular institucional e municipal para o sistema de eventos: listagem com filtros e estatísticas, detalhes do evento, inscrição de participantes, lista de espera, área pública, painel administrativo CMS e gerenciamento de conta.
Consome a API Spring Boot do repositório `eventos-API` em `http://localhost:8080`.
Segue integralmente a skill unificada **`codiub-design`** (`SKILL.md` + `references/engineering.md`, `brand.md`, `tokens.md`, `components.md`, `layouts.md`, `voice.md`), que governa tanto o Design System (Modo Prefeitura — Duas Faces) quanto os padrões de Engenharia Corporativa (arquitetura, RBAC, `NotifierService.erroBlob()`, testes e execução nativa sem Docker).

---

## 1. Stack Tecnológica e Comandos do Terminal

- **Angular 15** (NgModule, **não** utilizar standalone components), TypeScript 4.9 (`strict` + `strictTemplates`), RxJS 7.
- **Tailwind CSS 3** com o design system CODIUB (`tailwind.codiub.preset.js`, tema claro, Open Sans) e classes utilitárias semânticas em `src/styles.css`.
- **Formulários Reativos** (`FormGroup` / `FormControl` / `Validators`).

### Comandos Essenciais

```bash
npm ci                                             # Instalação limpa e reproduzível das dependências
npm start                                          # Servidor de desenvolvimento em http://localhost:4200
npx ng build                                       # Build de produção (obrigatório validar sem erros antes de commitar)
npx ng test --watch=false --browsers=ChromeHeadless # Bateria de testes unitários automatizados (33 testes)
```

---

## 2. Restrições Absolutas e Inegociáveis

1. **NUNCA USAR DOCKER:**
   - Este projeto não utiliza Docker, containers, Dockerfiles, docker-compose ou Nginx em container.
   - Não crie arquivos Docker nem sugira fluxos baseados em containerização. O deploy e a execução são diretos no Node.js / servidor HTTP nativo.
2. **NÃO REALIZAR GIT PUSH DIRETO:**
   - Nunca realize `git push` sem que o usuário aprove e peça explicitamente.
   - Trabalhe em branches limpas e faça commits atômicos com mensagens claras em português.

---

## 3. Estrutura do Projeto

```
src/app
├── compartilhado/    # AvisoComponent, ModalRotaComponent, NotifierComponent, PaginaNaoEncontradaComponent
├── models/           # Interfaces (Evento, Participante, ListaEspera, Page<T>, Categoria, Indicadores, Paginacao)
├── services/         # EventoService, ParticipanteService, ListaEsperaService, CategoriaService, AuthService, NotifierService
├── interceptors/     # AuthInterceptor (envia cookie HttpOnly withCredentials: true e trata HTTP 401)
├── guards/           # AuthGuard (valida a sessão com a API via /auth/me e aplica RBAC nas rotas)
├── eventos/          # Listagem pública/CMS, formulários de cadastro e edição de eventos
├── detalhes-eventos/ # Detalhes do evento, ocupação, formulário de inscrição, fila de espera e testes unitários
├── participantes/    # formularioParticipantes, lista-participantes, lista-espera
├── minha-conta/      # Alteração de senha e perfil do usuário logado
├── login/ cadastro/  # Telas de autenticação
└── app-routing.module.ts
```

---

## 4. Regras Arquiteturais e de Código

- **Registro de Componentes:** Todo novo componente, diretiva ou pipe deve ser declarado em `src/app/app.module.ts`.
- **Camada de Serviços HTTP, Nomenclatura e Tipagem:**
  - Chamadas HTTP ocorrem **exclusivamente** nos services (`services/*.service.ts`), jamais diretamente nos componentes.
  - Cada service deve consumir `environment.apiUrl` (`src/environments/environment.ts`), declarar retorno explícito (`Observable<T>`) em todos os métodos HTTP e passar paginação com `{ params: { page, size } }` em vez de concatenar query strings manualmente.
  - Utilizar sempre os nomes padronizados (`AuthService.cadastrar(username, senha)`, `CategoriaService.listar()`, `EventoService.exportarExcel(filtros, colunasOcultas)` e `EventosComponent.alternarEstatisticas()`). Aliases antigos (`cadatrar`, `listarCategorias`, `baixarExcelEventos`, `toogleEstatisticas`) existem apenas como `@deprecated` para retrocompatibilidade e não devem ser usados em código novo.
- **Comunicação entre Componentes:**
  - Utilizar `@Input()` para dados e `@Output() EventEmitter` com o sufixo `Output` (ex.: `participanteCadastradoOutput`).
  - O componente pai deve recarregar os dados necessários ao receber eventos de atualização.
- **Ciclo de Atualização Reativa:**
  - Após qualquer ação que altere o estado (inscrição, exclusão, fila, alteração de capacidade), recarregue sempre evento, contagens e listas, pois a API recalcula status e promove automaticamente participantes da fila.
- **Notificações, Feedback e Erros de Blob (`NotifierService`):**
  - Utilizar o `NotifierService` (`notifierService.sucesso()`, `notifierService.erro()`, `notifierService.aviso()`, `notifierService.info()`) para notificações flutuantes (toasts acessíveis WCAG AA com live region, duração padrão de 3s e pausa no hover/foco).
  - Para endpoints de download com `responseType: 'blob'` (como exportação Excel), utilize `await this.notifier.erroBlob(erro, 'Mensagem padrão')` para extrair mensagens JSON (`Problema.titulo`) de forma centralizada, **nunca** duplicando blocos `catch {}` vazios nos componentes.
  - **Não** criar timeouts manuais (`setTimeout`) com divs de toast ad-hoc nos componentes.
  - Utilizar `<app-aviso>` apenas para caixas de mensagem estáticas inline no fluxo da página.
- **Padrão de Paginação:**
  - Sempre utilizar as opções padronizadas `5 / 10 / 20` itens por página através da constante `OPCOES_TAMANHO_PAGINA` em `src/app/models/paginacao.ts`.
  - Utilizar o helper `calcularPaginasVisiveis(paginaAtual, totalPaginas)` para exibir controles de navegação limpos.
- **Diálogos de Confirmação e Foco:**
  - Ações destrutivas (excluir evento, remover participante, cancelar inscrição) usam o diálogo acessível CODIUB (`role="alertdialog"`, fechamento com `Esc`, foco inicial no Cancelar). **Nunca use `window.confirm`**.
  - Modais de cadastro devem mover automaticamente o foco para o primeiro campo ao abrir (ex.: `@ViewChild('campoNome')`).
- **Controle de Acesso na Interface e Rotas:**
  - Elementos restritos a administradores usam `*ngIf="authService.isAdmin()"`.
  - Rotas administrativas (como `eventos/:id/edicao` e `eventos/:id/edição`) devem declarar `data: { role: 'ADMIN' }` para bloqueio efetivo no `AuthGuard`.
- **Formatação e Padrão Linguístico:**
  - Nomes de variáveis, métodos, componentes e textos de interface em **português (pt-BR)**.
  - Textos em **sentence case** (apenas a primeira letra da frase em maiúscula), labels **sem dois-pontos** no final e botões iniciando por **verbo de ação** ("Cadastrar evento", "Salvar alterações", "Entrar na lista", "Voltar para eventos").

---

## 5. Design System CODIUB (Modo Prefeitura — Duas Faces)

O sistema segue rigorosamente o design institucional da Prefeitura Municipal de Uberaba (PMU) operado pela CODIUB, estruturado em duas faces:

### Face 1: Painel Administrativo CMS (`ADMIN`)
- **Navbar Superior:** Fundo Navy (`bg-codiub-navy` / `#042D62`) com logo branca horizontal (`assets/logo/prefeitura/pmu-colorida-texto-branco-horizontal.png`).
- **Sidebar Retrátil:** Lateral esquerda clara com botão hambúrguer `☰` recolhível (`GE`). Links: Eventos, Minha Conta e Portal da Prefeitura.
- **Sem Breadcrumb:** Foco operacional direto.
- **Painel de Indicadores:** Cards de KPIs no topo (`rounded-panel` com números de alto contraste) e botão de alternância `alternarEstatisticas()`.

### Face 2: Área Pública (`USER` e Cidadão Anônimo)
- **Cabeçalho Superior Branco:** Barra branca de altura compacta (`p-3`) com logo colorida horizontal (`assets/logo/prefeitura/pmu-colorida-horizontal.png`) e identificação do usuário / link "Minha conta" / botão de saída à direita.
- **Faixa de Título Navy:** Barra navy sólida (`bg-codiub-navy`, padding `p-5 md:p-10`) com título limpo em branco ("Eventos") em sentence case.
- **Breadcrumb Acessível:** `Portal da Prefeitura › FacilitaTudo › Início` com separador chevron em `text-gray-500` (contraste WCAG AA).
- **Indicadores no Topo:** Na Área Pública (`!authService.isAdmin()`), a grade de 4 indicadores resumidos (`Eventos abertos`, `Em lista de espera`, `Total no recorte`, `Vagas ofertadas`) fica posicionada **no topo da página**, logo abaixo do cabeçalho `"Agenda de eventos"` e **acima** da barra única de filtros (`grid grid-cols-1 gap-3 sm:grid-cols-4 mb-8`).
- **Largura Fluida / Total:** O conteúdo da área pública utiliza a largura total da janela com respiro lateral padronizado (`px-4 py-5`), sem caixa estreita centralizada (`max-w-6xl` removido).
- **Rodapé Institucional:** Rodapé navy com assinatura da CODIUB em `gray-300` e logo `codiub-branca-horizontal.png`.

### Navegação, Telas de Autenticação e Acessibilidade (WCAG AA)
- **Botões de Retorno Padronizados (`.btn-secondary`):** Em `DetalhesEventosComponent` (`Voltar para eventos`, visível para `USER` e `ADMIN`) e `FormularioEdicaoEventosComponent` (`Voltar para detalhes do evento`), o retorno fica no cabeçalho da página usando `.btn-secondary` com ícone chevron à esquerda.
- **Logo Mobile em Login e Cadastro:** `LoginComponent` e `CadastroComponent` exibem `assets/logo/prefeitura/pmu-colorida-horizontal.png` (`class="mb-4 h-10 w-auto object-contain md:hidden"`) no topo do formulário para dispositivos móveis, já que a coluna lateral navy fica oculta abaixo de `md`.
- **Contraste WCAG AA em Separadores e Skeletons:** Separadores textuais de breadcrumb (`›`) e paginação (`·`) devem usar `text-gray-500` sobre fundo branco (nunca `text-gray-400`). Skeletons de campos devem usar o token `h-control` (nunca `h-[42px]`).
- **Paleta de Cores e Raios:**
  - `codiub-brand` (`#002069`): Botões primários (`btn-primary`), ações principais e títulos de destaque.
  - `codiub-navy` (`#042D62`): Superfícies (navbar, barra de título pública, cabeçalhos de tabela e rodapé).
  - `blue-600`: Ações secundárias, links e itens ativos da paginação.
  - Raios: `rounded-lg` (cards e diálogos), `rounded-panel` (KPIs e indicadores), `rounded-full` (botões pílula de 42px e badges).

---

## 6. Autenticação, Segurança e Integração com a API

- **Token JWT em Cookie HttpOnly:**
  - O token `eventos_token` é gravado pela API como cookie `HttpOnly`. O front-end **não tem acesso** ao token e **nunca** deve armazená-lo em `localStorage` ou `sessionStorage`.
  - O `AuthInterceptor` envia automaticamente `withCredentials: true` para todas as requisições destinadas à API (`http://localhost:8080`).
- **Sessão do Usuário e RBAC:**
  - O `AuthService` mantém em memória apenas `{ username, role }`.
  - As rotas protegidas utilizam `canActivate: [AuthGuard]`, que consulta `GET /auth/me` para validar a sessão e confere `route?.data?.['role'] === 'ADMIN'` para rotas exclusivas de administração, redirecionando usuários comuns para `/eventos`.
  - Respostas HTTP 401 deslogam automaticamente o usuário e redirecionam para a tela de login.
- **Endpoints Específicos Integrados:**
  - `GET /eventos/indicadores` → Consumido por `EventoService.obterIndicadores()`.
  - `GET /eventos/excel` → Consumido por `EventoService.exportarExcel()`.
  - `PUT /auth/alterar-senha` → Consumido por `AuthService.alterarSenha()`.
  - `GET /categorias` → Consumido por `CategoriaService.listar()`.

---

## 7. Padrão de Commits e Testes

- **Suíte de Testes (33 testes unitários):** Cobre `AppComponent`, `NotifierService` (incluindo `erroBlob`), `NotifierComponent`, `AuthService` (incluindo `cadastrar`), `EventoService`, `MinhaContaComponent`, `DetalhesEventosComponent`, `ListaParticipantesComponent`, `ParticipantesComponent` e helpers de paginação.
- Mensagens em **português (pt-BR)** no padrão Conventional Commits:
  - `feat:` Nova funcionalidade ou tela
  - `fix:` Correção de bug
  - `refactor:` Refatoração sem alteração de comportamento
  - `style:` Ajustes visuais ou de formatação
  - `test:` Criação ou manutenção de testes
  - `docs:` Alterações em documentação (`README.md`, `CLAUDE.md`, `GEMINI.md`)
  - `chore:` Configurações e dependências
