# CLAUDE.md — Eventos Front

Front-end Angular institucional e municipal para o sistema de eventos: listagem com filtros e estatísticas, detalhes do evento, inscrição de participantes, lista de espera, área pública, painel administrativo CMS e gerenciamento de conta.
Consome a API Spring Boot do repositório `eventos-API` em `http://localhost:8080`.

---

## 1. Stack Tecnológica e Comandos do Terminal

- **Angular 15** (NgModule, **não** utilizar standalone components), TypeScript 4.9, RxJS 7.
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
├── guards/           # AuthGuard (valida a sessão com a API via /auth/me)
├── eventos/          # Listagem pública/CMS, formulários de cadastro e edição de eventos
├── detalhes-eventos/ # Detalhes do evento, ocupação, formulário de inscrição e fila de espera
├── participantes/    # formularioParticipantes, lista-participantes, lista-espera
├── minha-conta/      # Alteração de senha e perfil do usuário logado
├── login/ cadastro/  # Telas de autenticação
└── app-routing.module.ts
```

---

## 4. Regras Arquiteturais e de Código

- **Registro de Componentes:** Todo novo componente, diretiva ou pipe deve ser declarado em `src/app/app.module.ts`.
- **Camada de Serviços HTTP:**
  - Chamadas HTTP ocorrem **exclusivamente** nos services (`services/*.service.ts`), jamais diretamente nos componentes.
  - Cada service deve consumir `environment.apiUrl` (`src/environments/environment.ts`).
- **Comunicação entre Componentes:**
  - Utilizar `@Input()` para dados e `@Output() EventEmitter` com o sufixo `Output` (ex.: `participanteCadastradoOutput`).
  - O componente pai deve recarregar os dados necessários ao receber eventos de atualização.
- **Ciclo de Atualização Reativa:**
  - Após qualquer ação que altere o estado (inscrição, exclusão, fila, alteração de capacidade), recarregue sempre evento, contagens e listas, pois a API recalcula status e promove automaticamente participantes da fila.
- **Notificações e Feedback (NotifierService):**
  - Utilizar o `NotifierService` (`notifierService.sucesso()`, `notifierService.erro()`, `notifierService.aviso()`, `notifierService.info()`) para notificações flutuantes (toasts acessíveis WCAG AA com live region, duração padrão de 3s e pausa no hover/foco).
  - **Não** criar timeouts manuais (`setTimeout`) com divs de toast ad-hoc nos componentes.
  - Utilizar `<app-aviso>` apenas para caixas de mensagem estáticas inline no fluxo da página.
- **Padrão de Paginação:**
  - Sempre utilizar as opções padronizadas `5 / 10 / 20` itens por página através da constante `OPCOES_TAMANHO_PAGINA` em `src/app/models/paginacao.ts`.
  - Utilizar o helper `calcularPaginasVisiveis(paginaAtual, totalPaginas)` para exibir controles de navegação limpos.
- **Diálogos de Confirmação:**
  - Ações destrutivas (excluir evento, remover participante, cancelar inscrição) usam o diálogo acessível CODIUB (`role="alertdialog"`, fechamento com `Esc`, foco inicial no Cancelar). **Nunca use `window.confirm`**.
- **Controle de Acesso na Interface:**
  - Elementos restritos a administradores usam `*ngIf="authService.isAdmin()"`.
- **Formatação e Padrão Linguístico:**
  - Nomes de variáveis, métodos, componentes e textos de interface em **português (pt-BR)**.
  - Textos em **sentence case** (apenas a primeira letra da frase em maiúscula), labels **sem dois-pontos** no final e botões iniciando por **verbo de ação** ("Cadastrar evento", "Salvar alterações", "Entrar na lista").

---

## 5. Design System CODIUB (Modo Prefeitura — Duas Faces)

O sistema segue rigorosamente o design institucional da Prefeitura Municipal de Uberaba (PMU) operado pela CODIUB, estruturado em duas faces:

### Face 1: Painel Administrativo CMS (`ADMIN`)
- **Navbar Superior:** Fundo Navy (`bg-codiub-navy` / `#042D62`) com logo branca horizontal (`assets/logo/prefeitura/pmu-colorida-texto-branco-horizontal.png`).
- **Sidebar Retrátil:** Lateral esquerda clara com botão hambúrguer `☰` recolhível. Links: Eventos, Participantes, Lista de Espera, Minha Conta e Sair.
- **Sem Breadcrumb:** Foco operacional direto.
- **Painel de Indicadores:** Cards de KPIs no topo (`rounded-panel` com números de alto contraste).

### Face 2: Área Pública (`USER` e Cidadão Anônimo)
- **Cabeçalho Superior Branco:** Barra branca de altura compacta (`p-3`) com logo colorida horizontal (`assets/logo/prefeitura/pmu-colorida-horizontal.png`) e identificação do usuário / link "Minha conta" / botão de saída à direita.
- **Faixa de Título Navy:** Barra navy sólida (`bg-codiub-navy`, padding `p-5 md:p-10`) com título limpo em branco ("Eventos") em sentence case.
- **Breadcrumb Acessível:** `Portal da Prefeitura › FacilitaTudo › Início` com separador chevron.
- **Largura Fluida / Total:** O conteúdo da área pública utiliza a largura total da janela com respiro lateral padronizado (`px-4 py-5`), sem caixa estreita centralizada (`max-w-6xl` removido).
- **Rodapé Institucional:** Rodapé navy com assinatura da CODIUB em `gray-300` e logo `codiub-branca-horizontal.png`.

### Paleta de Cores e Hierarquia Visual
- `codiub-brand` (`#002069`): Botões primários (`btn-primary`), ações principais e títulos de destaque.
- `codiub-navy` (`#042D62`): Superfícies (navbar, barra de título pública, cabeçalhos de tabela e rodapé).
- `blue-600`: Ações secundárias, links e itens ativos da paginação.
- Raios de borda:
  - `rounded-lg`: Padrão para cards e caixas de diálogo.
  - `rounded-panel`: Cards de KPIs e painéis de dados.
  - `rounded-full`: Pílulas para botões de 42px e badges de status.

---

## 6. Autenticação, Segurança e Integração com a API

- **Token JWT em Cookie HttpOnly:**
  - O token `eventos_token` é gravado pela API como cookie `HttpOnly`. O front-end **não tem acesso** ao token e **nunca** deve armazená-lo em `localStorage` ou `sessionStorage`.
  - O `AuthInterceptor` envia automaticamente `withCredentials: true` para todas as requisições destinadas à API (`http://localhost:8080`).
- **Sessão do Usuário:**
  - O `AuthService` mantém em memória apenas `{ username, role }`.
  - As rotas protegidas utilizam `canActivate: [AuthGuard]`, que consulta `GET /auth/me` para validar a sessão.
  - Respostas HTTP 401 deslogam automaticamente o usuário e redirecionam para a tela de login.
- **Endpoints Específicos Integrados:**
  - `GET /eventos/indicadores` → Consumido por `EventoService.obterIndicadores()`.
  - `GET /eventos/excel` → Consumido por `EventoService.exportarExcel()`.
  - `PUT /auth/alterar-senha` → Consumido por `AuthService.alterarSenha()`.
  - `GET /categorias` → Consumido por `CategoriaService.listar()`.

---

## 7. Padrão de Commits

Mensagens em **português (pt-BR)** no padrão Conventional Commits:
- `feat:` Nova funcionalidade ou tela
- `fix:` Correção de bug
- `refactor:` Refatoração sem alteração de comportamento
- `style:` Ajustes visuais ou de formatação
- `test:` Criação ou manutenção de testes
- `docs:` Alterações em documentação (`README.md`, `CLAUDE.md`, `GEMINI.md`)
- `chore:` Configurações e dependências
