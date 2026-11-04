# CLAUDE.md — Eventos Front

Front-end Angular para o sistema de eventos: listagem com filtros e estatísticas, detalhes do evento,
inscrição de participantes, lista de espera, login e cadastro.
Consome a API Spring Boot do repositório `eventos-API` em `http://localhost:8080`.

## Stack e comandos

- Angular 15 (NgModule, **não** standalone components), TypeScript 4.9, RxJS 7.
- Tailwind CSS 3 (tema escuro) com classes utilitárias próprias em `src/styles.css`.
- Formulários com **Reactive Forms** (`FormGroup` / `FormControl` / `Validators`).

```bash
npm ci            # instalar dependências
npm start         # ng serve em http://localhost:4200 (porta liberada no CORS da API)
npx ng build      # build; precisa passar sem erros antes de commitar
```

## Estrutura

```
src/app
├── models/          # Interfaces (Evento, Participante, ListaEspera, Page<T>, Categoria...) + helpers de exibição
├── services/        # Um service por recurso da API (evento, participante, lista-espera, categoria, auth)
├── interceptors/    # AuthInterceptor: injeta "Authorization: Bearer <token>"
├── guards/          # AuthGuard: bloqueia rotas sem token válido
├── eventos/         # Página de eventos + formulários de cadastro e edição
├── detalhes-eventos/# Página de detalhes (ocupação, formulário de inscrição, participantes, lista de espera)
├── participantes/   # formularioParticipantes, lista-participantes, lista-espera
├── login/ cadastro/ # Autenticação
└── app-routing.module.ts
```

## Regras de projeto

- **Todo componente novo deve ser declarado em `app.module.ts`.**
- **Chamadas HTTP só nos services** (`services/*.service.ts`), nunca direto no componente.
  Cada service tem seu `apiUrl` (`http://localhost:8080/<recurso>`).
- Tipos de dados em `models/`. Respostas paginadas usam `Page<T>` (`content`, `totalPages`, `totalElements`...).
- Comunicação entre componentes: `@Input()` para dados, `@Output() EventEmitter` para avisar o pai,
  com o padrão de nome `algoAconteceuOutput` (ex.: `participanteCadastradoOutput`).
  O pai recarrega o que precisar (ver `DetalhesEventosComponent.atualizarParticipantes()`).
- Após qualquer ação que muda dados (inscrição, exclusão, fila), **recarregue evento, contagens e listas**,
  porque a API pode ter alterado o status ou promovido alguém da lista de espera.
- Mensagens de erro: mostrar `erro.error?.titulo ?? 'mensagem padrão'`. O `titulo` vem da API, já em português.
  Mensagens de sucesso e erro somem com `setTimeout` (2 a 3,5s).
- Botões de envio ficam desabilitados enquanto `enviando` é true ou o formulário é inválido.
- Ações de exclusão pedem `confirm(...)` antes.
- Ações restritas a admin são escondidas com `*ngIf="authService.isAdmin()"`. A API também valida;
  esconder no front é só UX.
- Nomes de componentes, variáveis, métodos e textos da interface em **português**.
  Mantenha os campos no formato da API (`data_evento`, `capacidade_maxima`, `categoriaId`...).
- Datas enviadas à API em ISO com fuso de Brasília: `valor + ':00-03:00'` (inputs `datetime-local`).
  Exibição com o pipe `date` (locale `pt-BR` já registrado).

### Visual (Tailwind)

- Tema escuro: fundos `slate-900/950`, bordas `slate-800`, texto `slate-200/400`, destaque `indigo-500`.
- Use as classes de `styles.css` antes de criar estilos novos: `card`, `input`, `input-invalid`, `label`,
  `field-error`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-danger`, `btn-icon`, `badge`.
- Cores de status: Aberto = `emerald`, Lotado = `rose`, Encerrado e lista de espera = `amber`
  (ver `statusEvento()` em `models/evento.ts`). Cores de categoria em `corCategoria()` (`models/categoria.ts`).
- Layout responsivo (mobile primeiro, `sm:` / `lg:`). Evite CSS no `.component.css` quando Tailwind resolve.

### Autenticação

- O token JWT fica em `sessionStorage` (`token`); o `AuthService` lê `sub` (username) e `role` do payload.
- Rotas internas usam `canActivate: [AuthGuard]`; `/auth/login` e `/auth/cadastro` são públicas.
- Token expirado ou inválido: o guard limpa a sessão e redireciona para o login.

## Regras de negócio (aplicadas pela API, refletidas na interface)

### Eventos
- Obrigatórios: nome, local, capacidade (mínimo 1), data e categoria. **A data não pode estar no passado.**
- Status: `ABERTO` (tem vaga), `LOTADO` (participantes ≥ capacidade), `ENCERRADO` (a data passou,
  encerrado automaticamente pela API).
- O status nunca é escolhido pelo usuário: a API recalcula.
- Só é possível excluir eventos sem participantes. Editar e excluir: apenas `ADMIN`.

### Participantes
- Nome e email obrigatórios (email válido). O mesmo email não pode se inscrever duas vezes no mesmo evento.
- Evento `ENCERRADO`: formulário de inscrição desabilitado.
- Somente `ADMIN` exclui participantes. O Excel exportado contém apenas participantes.

### Lista de espera
- Evento `LOTADO` que ainda não ocorreu: o formulário de inscrição vira **"Entrar na lista de espera"**
  e mostra a posição recebida.
- Fila por ordem de chegada. Quando um participante sai, **o primeiro da fila assume a vaga automaticamente**
  (feito pela API). Se a capacidade do evento aumentar, a fila também é chamada.
- O card "Lista de Espera" aparece quando o evento está lotado ou ainda há gente na fila.
  Somente `ADMIN` remove pessoas da fila.
- Um email não pode estar na fila e como participante ao mesmo tempo.

### Usuários
- Papéis `ADMIN` e `USER`. O cadastro pela tela sempre cria `USER`.
- Login devolve um token válido por 1 hora.

## Regras de commit

- Mensagens em **português**, no formato Conventional Commits: `tipo: descrição curta`.
  - `feat:` nova funcionalidade ou tela
  - `fix:` correção de bug
  - `refactor:` mudança de código sem mudar comportamento
  - `style:` mudanças apenas visuais ou de formatação
  - `docs:` documentação (README, CLAUDE.md)
  - `chore:` build, dependências, configuração
  - `test:` testes
- Primeira linha com até ~72 caracteres, em minúsculas e sem ponto final.
  Ex.: `feat: lista de espera nos detalhes do evento`.
- Se precisar, deixe uma linha em branco e detalhe em tópicos (`- ...`) o que mudou e por quê.
- Um commit por assunto. `npx ng build` precisa passar antes do commit.
- Não comite `node_modules/`, `dist/`, `.angular/` nem `console.log` de debug.
- Mudanças que dependem de alteração na API devem ter a mudança correspondente no `eventos-API`,
  de preferência com o mesmo nome de branch nos dois repositórios, e o PR da API deve ser mergeado antes ou junto.
- Trabalhe em branch própria e abra Pull Request para a `main`. Não faça push direto na `main`.
