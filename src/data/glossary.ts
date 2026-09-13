/**
 * Glossário Completo e Ampliado de termos técnicos ágeis e de engenharia de software.
 * Exibido como popover interativo em qualquer ponto da interface.
 */
export interface GlossaryEntry {
  term: string;         // Exatamente como aparece no texto (case-insensitive match)
  aliases?: string[];   // Variações e siglas do mesmo termo
  definition: string;   // Explicação em português, simples, didática e direta
  example?: string;     // Exemplo prático de aplicação no dia a dia
  category: 'scrum' | 'kanban' | 'eng' | 'agile';
}

export const GLOSSARY: GlossaryEntry[] = [
  // ── 1. Scrum & Framework ────────────────────────────────────────────────────
  {
    term: 'Sprint',
    aliases: ['Sprints'],
    definition: 'Iteração de tempo fixo (geralmente de 1 a 4 semanas) onde o time transforma itens do backlog em um incremento utilizável de software.',
    example: 'Durante a Sprint 2, entregamos a autenticação e o carrinho de compras.',
    category: 'scrum',
  },
  {
    term: 'Scrum Master',
    aliases: ['Scrum Masters', 'SM'],
    definition: 'Líder servidor que garante que o time compreenda e pratique o Scrum, facilitando cerimônias e eliminando impedimentos que travam a equipe.',
    example: 'O Scrum Master protegeu os devs de reuniões extras marcadas de surpresa pela diretoria.',
    category: 'scrum',
  },
  {
    term: 'Product Owner',
    aliases: ['Product Owners', 'PO'],
    definition: 'Responsável por maximizar o valor do produto e gerenciar ativamente o Product Backlog, definindo prioridades de negócio.',
    example: 'A Product Owner conversou com os clientes e priorizou o pagamento via PIX no topo do quadro.',
    category: 'scrum',
  },
  {
    term: 'Daily',
    aliases: ['Daily Scrum', 'Daily Standup', 'Standup', 'Stand-up'],
    definition: 'Reunião diária de alinhamento de 15 minutos para inspecionar o progresso em direção à Meta da Sprint e planejar as próximas 24 horas.',
    example: 'Na Daily das 9h, Carlos avisou que precisava de ajuda no Code Review para não travar o fluxo.',
    category: 'scrum',
  },
  {
    term: 'Sprint Goal',
    aliases: ['Meta da Sprint', 'Sprint Goals'],
    definition: 'O objetivo principal e unificador que o time se compromete a alcançar até o encerramento da Sprint.',
    example: 'Meta da Sprint: "Permitir que o cliente conclua um pedido com pagamento aprovado."',
    category: 'scrum',
  },
  {
    term: 'Sprint Backlog',
    definition: 'Conjunto de itens selecionados do Product Backlog para a Sprint atual, juntamente com o plano de ação para entregá-los.',
    example: 'Nenhum item pode ser adicionado ao Sprint Backlog sem o consentimento dos Developers.',
    category: 'scrum',
  },
  {
    term: 'Product Backlog',
    aliases: ['Backlog'],
    definition: 'Lista ordenada de tudo o que é conhecido como necessário no produto. É a fonte única de requisitos para qualquer alteração.',
    example: 'O débito técnico foi registrado no Product Backlog para ser planejado na próxima iteração.',
    category: 'scrum',
  },
  {
    term: 'Sprint Planning',
    aliases: ['Planning'],
    definition: 'Cerimônia que inicia a Sprint, onde o time define o que pode ser entregue e como esse trabalho será realizado.',
    example: 'Na Planning, o time estimou 32 pontos de histórias compatíveis com o histórico de velocidade.',
    category: 'scrum',
  },
  {
    term: 'Sprint Review',
    aliases: ['Review'],
    definition: 'Sessão de demonstração ao final da Sprint com stakeholders para inspecionar o incremento e adaptar o backlog.',
    example: 'Na Sprint Review, o cliente testou a tela de checkout ao vivo e aprovou o fluxo.',
    category: 'scrum',
  },
  {
    term: 'Retrospectiva',
    aliases: ['Sprint Retrospective', 'Retro'],
    definition: 'Cerimônia final onde o time analisa seu processo de trabalho, relacionamentos e ferramentas para planejar melhorias contínuas.',
    example: 'Na Retro, decidimos que PRs com mais de 400 linhas devem ser divididos obrigatoriamente.',
    category: 'scrum',
  },
  {
    term: 'Velocity',
    aliases: ['Velocidade'],
    definition: 'Média de pontos de história (Story Points) concluídos por sprint pelo time. Mede capacidade histórica, nunca rendimento individual.',
    example: 'Com velocity de 25 pontos, o time soube que não conseguiria puxar 40 pontos na sprint.',
    category: 'scrum',
  },
  {
    term: 'Incremento',
    aliases: ['Incrementos', 'Increment'],
    definition: 'Versão funcional, testada e utilizável do produto que atende ao Definition of Done ao final de cada iteração.',
    example: 'Cada nova entrega gera um incremento pronto para ser publicado para os usuários finais.',
    category: 'scrum',
  },
  {
    term: 'DoD',
    aliases: ['Definition of Done', 'Critério de Pronto'],
    definition: 'Acordo formal que define os critérios de qualidade para que um item seja considerado 100% concluído (ex: testes, revisão, homologação).',
    example: 'Sem testes unitários e aprovação em QA, o card viola o DoD e não pode ir para DONE.',
    category: 'scrum',
  },
  {
    term: 'DoR',
    aliases: ['Definition of Ready', 'Critério de Preparado'],
    definition: 'Conjunto de critérios necessários para que um item esteja pronto para ser puxado para o desenvolvimento na Sprint.',
    example: 'A história cumpriu o DoR pois já tinha critérios de aceite e layout do Figma anexado.',
    category: 'scrum',
  },
  {
    term: 'Timebox',
    aliases: ['Timeboxed'],
    definition: 'Período máximo de tempo fixado para a realização de uma atividade ou reunião, impedindo discussões intermináveis.',
    example: 'A Daily possui um timebox estrito de 15 minutos.',
    category: 'scrum',
  },

  // ── 2. Kanban & Métricas de Fluxo ──────────────────────────────────────────
  {
    term: 'Kanban',
    definition: 'Método visual de gestão de trabalho que enfatiza a entrega just-in-time e limita a quantidade de trabalho em progresso simultâneo.',
    example: 'Usamos as colunas do quadro Kanban para enxergar onde estão os gargalos do time.',
    category: 'kanban',
  },
  {
    term: 'WIP',
    aliases: ['Work in Progress', 'WIP Limit', 'Limite de WIP'],
    definition: 'Quantidade de tarefas em andamento em um mesmo estado. Limitar o WIP força a equipe a terminar tarefas antes de iniciar novas.',
    example: 'Definimos WIP máximo de 2 cards em Code Review para que os PRs não fiquem mofando.',
    category: 'kanban',
  },
  {
    term: 'Lead Time',
    definition: 'Tempo total decorrido desde a solicitação do item (criação no backlog) até a sua entrega final em produção.',
    example: 'Reduzimos nosso Lead Time de 18 para 5 dias eliminando esperas desnecessárias.',
    category: 'kanban',
  },
  {
    term: 'Cycle Time',
    definition: 'Tempo que o time leva para concluir um item a partir do momento em que começa a trabalhar ativamente nele.',
    example: 'O Cycle Time médio de desenvolvimento até aprovação em QA foi de 2 dias.',
    category: 'kanban',
  },
  {
    term: 'Swarming',
    aliases: ['Enxame'],
    definition: 'Prática colaborativa em que múltiplos membros focam juntos em um único item impedido ou de alta prioridade até destravá-lo.',
    example: 'Fizemos um swarming de 3 desenvolvedores para ajudar o QA a homologar o checkout antes do fim da Sprint.',
    category: 'kanban',
  },
  {
    term: 'Gargalo',
    aliases: ['Bottleneck'],
    definition: 'Etapa do fluxo com menor capacidade de processamento que limita a velocidade de entrega de todo o sistema.',
    example: 'A coluna de Code Review virou um gargalo porque só havia um Tech Lead revisando tudo.',
    category: 'kanban',
  },

  // ── 3. Engenharia de Software & Práticas Técnicas ───────────────────────────
  {
    term: 'PR',
    aliases: ['Pull Request', 'Pull Requests', 'Merge Request'],
    definition: 'Solicitação formal para mesclar alterações de código de um branch de desenvolvimento no branch principal do projeto.',
    example: 'Marcos abriu um PR detalhando as alterações na camada de persistência com Redis.',
    category: 'eng',
  },
  {
    term: 'Code Review',
    aliases: ['Revisão de Código'],
    definition: 'Revisão de código por pares para encontrar vulnerabilidades, assegurar padrões arquiteturais e compartilhar conhecimento.',
    example: 'No Code Review, sugerimos trocar loops aninhados por mapas indexados para otimizar a performance.',
    category: 'eng',
  },
  {
    term: 'QA',
    aliases: ['Quality Assurance', 'Analista de QA', 'Homologação'],
    definition: 'Garantia de Qualidade — verificação sistemática de que o produto atende aos critérios de aceite e não introduz regressões.',
    example: 'A Júlia testou os casos de borda em QA e descobriu um erro com cupons expirados.',
    category: 'eng',
  },
  {
    term: 'Staging',
    aliases: ['Ambiente de Staging', 'Homologação'],
    definition: 'Ambiente de teste idêntico ao de produção onde a equipe valida o comportamento integrado do sistema antes do lançamento.',
    example: 'O build foi publicado em Staging para validação da equipe de testes.',
    category: 'eng',
  },
  {
    term: 'Deploy',
    aliases: ['Deployment', 'Deploys'],
    definition: 'Processo de disponibilizar uma nova versão do software em um servidor ou ambiente de nuvem acessível.',
    example: 'Configuramos deploy automático para que todo merge na branch main vá para staging.',
    category: 'eng',
  },
  {
    term: 'Bug',
    aliases: ['Bugs', 'Defeito'],
    definition: 'Falha ou comportamento incorreto no software que gera resultados inesperados ou bloqueia o uso pelo usuário.',
    example: 'Um bug de arredondamento no carrinho de compras cobrava 1 centavo a mais no PIX.',
    category: 'eng',
  },
  {
    term: 'Spike',
    aliases: ['Spikes', 'Spike Ágil'],
    definition: 'Atividade de pesquisa ou prototipação com tempo delimitado (timebox) usada para resolver dúvidas técnicas ou estimar riscos.',
    example: 'Rodamos uma Spike de 3 horas para descobrir se o Redis atenderia a nossa demanda de cache.',
    category: 'eng',
  },
  {
    term: 'JWT',
    aliases: ['JSON Web Token'],
    definition: 'Padrão compacto e seguro para autenticação e troca de informações entre partes no formato de objetos JSON assinados digitalmente.',
    example: 'A API valida o token JWT no cabeçalho Authorization antes de permitir o checkout.',
    category: 'eng',
  },
  {
    term: 'Redis',
    definition: 'Armazenamento de estrutura de dados em memória de altíssima velocidade, amplamente utilizado como banco de dados em cache e gerenciador de filas.',
    example: 'Armazenamos as sessões ativas no Redis para não sobrecarregar o banco Postgres.',
    category: 'eng',
  },
  {
    term: 'Postgres',
    aliases: ['PostgreSQL'],
    definition: 'Sistema de gerenciamento de banco de dados relacional robusto, de código aberto e com forte consistência transacional (ACID).',
    example: 'A tabela de pedidos e transações financeiras fica no Postgres por segurança.',
    category: 'eng',
  },
  {
    term: 'Docker',
    definition: 'Plataforma de virtualização leve em contêineres que garante que o software rode de forma idêntica na máquina do dev e na nuvem.',
    example: 'Subimos o banco e a API com um único comando docker-compose up.',
    category: 'eng',
  },
  {
    term: 'Feature Flag',
    aliases: ['Feature Flags', 'Feature Toggle', 'Toggles'],
    definition: 'Chave no código que permite ativar ou desativar uma funcionalidade em tempo real sem precisar de um novo deploy.',
    example: 'Usamos uma Feature Flag para liberar a nova busca apenas para 10% dos usuários beta.',
    category: 'eng',
  },
  {
    term: 'Mob Programming',
    aliases: ['Ensemble Programming'],
    definition: 'Prática de engenharia onde toda a equipe trabalha simultaneamente na mesma tarefa, no mesmo computador e no mesmo código.',
    example: 'Fizemos Mob Programming para refatorar o módulo legado de cálculo de frete.',
    category: 'eng',
  },
  {
    term: 'Pair Programming',
    aliases: ['Programação em Par'],
    definition: 'Dois desenvolvedores trabalhando lado a lado na mesma estação: um piloto (escrevendo código) e um copiloto (revisando em tempo real).',
    example: 'Carlos e Marcos fizeram pair programming para corrigir a falha de concorrência no estoque.',
    category: 'eng',
  },
  {
    term: 'CI/CD',
    aliases: ['CI', 'CD', 'Pipeline'],
    definition: 'Integração Contínua e Entrega Contínua — automação de testes, build e deploy de novas versões do software sem intervenção manual.',
    example: 'O pipeline de CI/CD reprovou o commit porque a cobertura de testes caiu.',
    category: 'eng',
  },
  {
    term: 'Dívida Técnica',
    aliases: ['Débito Técnico', 'Technical Debt'],
    definition: 'O custo futuro de retrabalho causado pela escolha de uma solução rápida e simplista em vez de uma abordagem bem estruturada.',
    example: 'A pressa em lançar sem testes gerou dívida técnica que atrasou as sprints seguintes.',
    category: 'eng',
  },
  {
    term: 'Refatoração',
    aliases: ['Refactor', 'Refatorar', 'Refactoring'],
    definition: 'Melhoria na estrutura interna do código para torná-lo mais limpo e sustentável, sem alterar seu comportamento externo observável.',
    example: 'Refatoramos a função de 300 linhas dividindo-a em 3 serviços reutilizáveis.',
    category: 'eng',
  },
  {
    term: 'Websocket',
    aliases: ['WebSockets'],
    definition: 'Protocolo de comunicação bidirecional em tempo real entre cliente e servidor sobre uma única conexão persistente.',
    example: 'Usamos Websocket para atualizar no mapa a localização do entregador a cada segundo.',
    category: 'eng',
  },
  {
    term: 'API',
    aliases: ['APIs', 'REST', 'RESTful'],
    definition: 'Interface de Programação de Aplicações — conjunto de regras e endpoints que permite que sistemas diferentes conversem entre si.',
    example: 'O frontend consome a API do backend para consultar o catálogo de produtos.',
    category: 'eng',
  },
  {
    term: 'DevOps',
    definition: 'União cultural e tecnológica entre desenvolvimento de software (Dev) e operações de infraestrutura (Ops) para entregas rápidas e confiáveis.',
    example: 'A cultura DevOps permitiu ao time realizar 5 deploys por dia com rollback automático.',
    category: 'eng',
  },
  {
    term: 'LGPD',
    aliases: ['GDPR'],
    definition: 'Lei Geral de Proteção de Dados — legislação que exige segurança, consentimento e privacidade estrita no tratamento de dados de usuários.',
    example: 'Vazar o e-mail ou cartão de usuários por falta de validação é uma violação gravíssima da LGPD.',
    category: 'eng',
  },

  // ── 4. Princípios Ágeis & Liderança ─────────────────────────────────────────
  {
    term: 'Story Points',
    aliases: ['Pontos', 'Story Point'],
    definition: 'Medida relativa e abstrata usada para estimar o esforço, complexidade e incerteza exigidos para implementar uma história de usuário.',
    example: 'Estimamos a tarefa em 5 Story Points por conta da incerteza com a API externa.',
    category: 'agile',
  },
  {
    term: 'Servant Leadership',
    aliases: ['Liderança Servidora', 'Servo-Líder'],
    definition: 'Filosofia de liderança onde o foco principal é servir aos membros do time, promovendo autonomia, crescimento e suporte mútuo.',
    example: 'O Scrum Master atuou com liderança servidora ao perguntar "como posso ajudar vocês a destravar?".',
    category: 'agile',
  },
  {
    term: 'Empirismo',
    definition: 'Fundamento central do Scrum que defende que o conhecimento vem da experiência prática e decisões devem ser baseadas em dados observáveis.',
    example: 'O empirismo apoia-se em 3 pilares: Transparência, Inspeção e Adaptação contínua.',
    category: 'agile',
  },
  {
    term: 'Scope Creep',
    aliases: ['Aumento de Escopo'],
    definition: 'Crescimento descontrolado do escopo de um projeto ou sprint sem ajuste correspondente de tempo, recursos ou trade-offs.',
    example: 'Adicionar 3 relatórios extras no meio da Sprint causou um scope creep que atrasou a entrega.',
    category: 'agile',
  },
  {
    term: 'Trade-off',
    aliases: ['Trade-offs'],
    definition: 'Troca consciente ou concessão: abrir mão de algo desejável para obter outro benefício mais prioritário no momento.',
    example: 'Fizemos um trade-off: para o PIX entrar na Sprint, despriorizamos a exportação em PDF.',
    category: 'agile',
  },
  {
    term: 'Anti-Padrão',
    aliases: ['Anti-pattern', 'Anti-patterns'],
    definition: 'Padrão de resposta ou comportamento comum que parece benéfico à primeira vista, mas que resulta em consequências negativas no longo prazo.',
    example: 'Exigir horas extras todo fim de semana é um anti-padrão clássico que gera turnover e bugs.',
    category: 'agile',
  },
];

/** Mapa de lookup rápido: todas as formas do termo (minúsculas) → entry */
export const GLOSSARY_MAP = new Map<string, GlossaryEntry>();
for (const entry of GLOSSARY) {
  GLOSSARY_MAP.set(entry.term.toLowerCase(), entry);
  for (const alias of entry.aliases ?? []) {
    GLOSSARY_MAP.set(alias.toLowerCase(), entry);
  }
}
