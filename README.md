# 🎟️ Eventos Front

Interface web desenvolvida em **Angular** para o gerenciamento de eventos e participantes, consumindo a [Eventos API](https://github.com/GabrielFuzaro/eventos-API).

> Projeto de estudo/portfólio construído para aplicar na prática Angular com Reactive Forms, comunicação entre componentes, paginação e consumo de API REST.

---

## 📋 Funcionalidades

- **Listagem de eventos** em grid responsivo, com paginação
- **Busca de eventos por nome** em tempo real
- **Filtro de eventos por status** (Aberto, Lotado, Encerrado), integrado com paginação do back-end
- **Cadastro e edição de eventos**, com formulários reativos e validação
- **Página de detalhes do evento**, exibindo informações completas
- **Cadastro de participantes** vinculado ao evento, com bloqueio automático quando o evento está lotado ou encerrado
- **Listagem paginada de participantes** por evento
- **Feedback visual de estado**: mensagens de sucesso/erro com desaparecimento automático, e indicação de carregamento durante o envio de formulários

---

## 🛠️ Tecnologias

| Categoria      | Tecnologia          |
|-----------------|-----------------------|
| Framework        | Angular 15            |
| Linguagem         | TypeScript 4.9        |
| Estilização       | Tailwind CSS 3         |
| Formulários       | Angular Reactive Forms |
| HTTP              | Angular HttpClient     |
| Roteamento        | Angular Router         |

---

## 🏗️ Arquitetura

O projeto segue a estrutura padrão do Angular CLI, organizada por funcionalidade (*feature-based*):

```
src/app
├── eventos/                      # Listagem, cadastro e edição de eventos
│   ├── formulario-eventos/
│   └── formulario-edicao-eventos/
├── detalhes-eventos/             # Página de detalhes de um evento específico
├── participantes/                # Cadastro e listagem de participantes
│   ├── formularioParticipantes/
│   └── lista-participantes/
├── models/                       # Interfaces TypeScript (Evento, Participante, Page)
└── services/                     # Comunicação com a API (HttpClient)
```

Cada funcionalidade principal (eventos, participantes) tem seus componentes de formulário e listagem separados, comunicando-se com o componente pai através de `@Input`/`@Output`.

---

## ▶️ Como executar

### Pré-requisitos

- Node.js e npm
- Angular CLI (`npm install -g @angular/cli`)
- [Eventos API](https://github.com/GabrielFuzaro/eventos-API) rodando localmente em `http://localhost:8080`

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/GabrielFuzaro/eventos-Front.git
   cd eventos-Front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   ng serve
   ```

4. Acesse `http://localhost:4200` no navegador

---

## 🚧 Próximos passos

- [ ] Mensagens de validação por campo nos formulários reativos
- [ ] Testes unitários dos componentes principais
- [ ] Tratamento de estado de carregamento na listagem inicial de eventos

---

## 👤 Autor

**Gabriel Fuzaro**
[GitHub](https://github.com/GabrielFuzaro)

> Este é o front-end do sistema. A API (Spring Boot) está disponível em [eventos-API](https://github.com/GabrielFuzaro/eventos-API).
