import { ChatChannel, ChatMessage, ChatDilemmaOption, DilemmaTemplate } from '../types/chat';

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'geral',
    name: 'geral',
    description: 'Anúncios do time, alinhamento e café virtual ☕',
    unreadCount: 0,
    iconName: 'hash',
  },
  {
    id: 'desenvolvimento',
    name: 'dev-team',
    description: 'Discussões técnicas, PRs, arquitetura e deploys 💻',
    unreadCount: 0,
    iconName: 'code',
  },
  {
    id: 'duvidas-scrum-master',
    name: 'duvidas-scrum-master',
    description: 'Decisões urgentes, bloqueios e aconselhamento ágil 🛡️',
    unreadCount: 1,
    iconName: 'help',
  },
  {
    id: 'alertas-bloqueios',
    name: 'alertas-e-bugs',
    description: 'Bugs críticos de QA, falhas em staging e impedimentos 🚨',
    unreadCount: 0,
    iconName: 'alert',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_init_1',
    channelId: 'geral',
    senderName: 'Ana Oliveira',
    senderRole: 'Product Owner',
    senderAvatar: '👩‍💼',
    content: 'Bom dia time! Backlog da Sprint priorizado no quadro. Nosso foco é ter o fluxo básico do Delivery funcionando.',
    timestamp: '08:55',
  },
  {
    id: 'msg_init_2',
    channelId: 'desenvolvimento',
    senderName: 'Marcos Souza',
    senderRole: 'Tech Lead',
    senderAvatar: '👨‍🏫',
    content: 'Bom dia pessoal! Lembrem-se que nossa meta de cobertura de testes automatizados é de no mínimo 80%. Não subam PRs sem testes.',
    timestamp: '09:02',
  },
  {
    id: 'msg_init_3',
    channelId: 'desenvolvimento',
    senderName: 'Carlos Silva',
    senderRole: 'Full-Stack Dev',
    senderAvatar: '👨‍💻',
    content: 'Show @Marcos! Já configurei o ambiente local com Docker e vou puxar o primeiro card de autenticação.',
    timestamp: '09:05',
  },
  {
    id: 'msg_init_4',
    channelId: 'alertas-bloqueios',
    senderName: 'Júlia Mendes',
    senderRole: 'QA Specialist',
    senderAvatar: '👩‍🔬',
    content: 'Atenção time: o ambiente de homologação (Staging) foi atualizado. Qualquer card movido para QA já pode ser testado por aqui.',
    timestamp: '09:10',
  },
  {
    id: 'msg_init_dilemma_1',
    channelId: 'duvidas-scrum-master',
    senderName: 'Carlos Silva',
    senderRole: 'Full-Stack Dev',
    senderAvatar: '👨‍💻',
    content: 'Fala @Scrum Master! Tô trabalhando no checkout e notei que a API legada do cliente tá muito lenta. Se eu refatorar agora vai atrasar a entrega da Sprint em 1 dia. Se eu deixar como tá, o código vai ficar com dívida técnica. O time tá travado aguardando sua decisão!',
    timestamp: '09:15',
    taggedRole: '@Scrum Master',
    isScrumMasterDecision: true,
    isResolved: false,
    dilemmaOptions: [
      {
        id: 'opt_carlos_1',
        label: 'Crie um card de Débito Técnico no Backlog e mantenha o foco na entrega do valor da Sprint.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 35,
        moraleDelta: +5,
        riskDelta: -1,
        responseReaction: 'Perfeito @Scrum Master! Já criei a task de débito técnico no Backlog do quadro e abri o PR para Code Review!',
        pedagogicalReason: 'Proteger a meta da Sprint (Sprint Goal) sem ignorar a qualidade interna através da rastreabilidade explícita no Backlog.',
        scrumGuideReference: 'Scrum Guide 2020: "Durante a Sprint, nenhuma mudança é feita que possa colocar em risco a Meta da Sprint. A qualidade não diminui."',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Card de Débito Técnico adicionado à coluna Backlog do quadro',
          newCard: {
            title: '🛠️ [DÉBITO TÉCNICO] Otimização e Cache da API de Checkout',
            description: 'Refatoração da rota legada para reduzir tempo de resposta de 800ms para 50ms.',
            category: 'BACKEND',
            color: '#f59e0b',
            status: 'BACKLOG',
            storyPoints: 3,
          }
        }
      },
      {
        id: 'opt_carlos_2',
        label: 'Pare tudo e refatore agora mesmo. Qualidade é inegociável!',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 20,
        moraleDelta: -5,
        riskDelta: +1,
        responseReaction: 'Beleza @Scrum Master, vou refatorar! Mas já aviso que o prazo da Sprint vai estourar.',
        pedagogicalReason: 'Embora a intenção técnica seja nobre, alterar o escopo unilateralmente sem conversar com o PO e time gera risco de entrega.',
        scrumGuideReference: 'Scrum Guide: O trabalho planejado para o Sprint Backlog não deve ser alterado de forma a comprometer a entrega combinada com os stakeholders.',
        boardEffect: {
          type: 'ADD_TAG_OR_RENAME',
          description: 'Card em desenvolvimento atualizado com tag de Refatoração Ativa e aumento de pontos',
          tagToAdd: '🔄 [REFACTORING ATIVO - 8 PTS]'
        }
      },
      {
        id: 'opt_carlos_3',
        label: 'Dê um jeito de fazer os dois fazendo hora extra hoje à noite.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -15,
        moraleDelta: -20,
        riskDelta: +2,
        responseReaction: 'Poxa @Scrum Master... hora extra de novo? O time vai ficar exausto e isso vai gerar mais bugs...',
        pedagogicalReason: 'Anti-padrão de comando e controle. Horas extras geram burnout, turnover e aumentam a taxa de defeitos em vez de resolver o fluxo.',
        scrumGuideReference: 'Princípios do Manifesto Ágil: "Os processos ágeis promovem desenvolvimento sustentável. Os patrocinadores, desenvolvedores e usuários devem ser capazes de manter um ritmo constante indefinidamente."',
        boardEffect: {
          type: 'ADD_TAG_OR_RENAME',
          description: 'Card marcado com alerta de Sobrecarga e Risco de Burnout',
          tagToAdd: '⚠️ [SOBRECARGA / HORA EXTRA]'
        }
      }
    ]
  }
];

export const CHAT_DILEMMAS_POOL: DilemmaTemplate[] = [
  {
    id: 'dilemma_scope_creep',
    channelId: 'duvidas-scrum-master',
    senderName: 'Ana Oliveira',
    senderRole: 'Product Owner',
    senderAvatar: '👩‍💼',
    content: 'Oi @Scrum Master! A diretoria pediu com urgência para adicionarmos integração com PIX ainda nessa Sprint. Eu sei que a Sprint já começou, mas eles disseram que é prioridade máxima. O time está paralisado aguardando sua orientação!',
    dilemmaOptions: [
      {
        id: 'scope_1',
        label: 'Vamos sentar com o time: para entrar o PIX, temos que remover itens de mesmo esforço do Sprint Backlog.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 40,
        moraleDelta: +10,
        riskDelta: 0,
        responseReaction: 'Boa @Scrum Master! O card do PIX entrou em A Fazer e movemos um card não essencial de volta para o Backlog. Equilíbrio mantido!',
        pedagogicalReason: 'Troca de escopo sustentável (Trade-off 1-por-1). Protege a capacidade da equipe sem dizer um "não" cego ao negócio.',
        scrumGuideReference: 'Scrum Guide: "O escopo pode ser clarificado e renegociado com o Product Owner conforme mais é aprendido."',
        boardEffect: {
          type: 'TRADE_OFF_SWAP',
          description: 'Card de PIX inserido em A Fazer (Sprint) e 1 card retornado para o Backlog do Produto',
          swapIn: {
            title: '⚡ Integração de Pagamento Instantâneo PIX',
            description: 'Geração de QR Code dinâmico com chave copia-e-cola e webhook de confirmação.',
            category: 'BACKEND',
            color: '#10b981',
            status: 'TODO',
            storyPoints: 5,
          },
          swapOutFromStatus: 'TODO',
          swapOutToStatus: 'BACKLOG'
        }
      },
      {
        id: 'scope_2',
        label: 'PIX vai para o topo do Product Backlog e será priorizado no próximo Sprint Planning semana que vem.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 35,
        moraleDelta: +15,
        riskDelta: -1,
        responseReaction: 'Entendido @Scrum Master! Inseri o card de PIX no topo do Backlog para a Sprint 2. Time continua focado na meta atual!',
        pedagogicalReason: 'Servant Leadership protege a equipe contra interrupções desordenadas e educa stakeholders sobre previsibilidade ágil.',
        scrumGuideReference: 'Scrum Guide: O Scrum Master serve à organização ajudando a entender o valor do empirismo e do planejamento em sprints fechadas.',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Card de PIX inserido no topo da lista Backlog para o próximo Sprint Planning',
          newCard: {
            title: '⚡ [SPRINT 2] Integração PIX e Pagamentos Instantâneos',
            description: 'Prioridade máxima refinada com o PO para o próximo planejamento.',
            category: 'BACKEND',
            color: '#10b981',
            status: 'BACKLOG',
            storyPoints: 5,
          }
        }
      },
      {
        id: 'scope_3',
        label: 'Coloca logo no quadro e manda o Carlos e o Marcos correrem mais.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -20,
        moraleDelta: -25,
        riskDelta: +2,
        responseReaction: 'O time acabou de reclamar no canal de dev... eles disseram que não vão conseguir testar nada com esse excesso de demanda.',
        pedagogicalReason: 'Violação total do compromisso do time. Gera sobrecarga, gera bugs e destrói a confiança entre PO e Devs.',
        scrumGuideReference: 'Valores do Scrum: Compromisso e Respeito. Não se empurra trabalho para o time sem o consentimento dos Developers.',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Card de PIX forçado em A Fazer sem compensação de escopo (WIP Estourado)',
          newCard: {
            title: '⚡ [SOBRECARGA] Integração PIX (Escopo Não Negociado)',
            description: 'Adicionado sem compensação de escopo pelo comando e controle.',
            category: 'BACKEND',
            color: '#ef4444',
            status: 'TODO',
            storyPoints: 8,
          }
        }
      }
    ]
  },
  {
    id: 'dilemma_huge_pr',
    channelId: 'desenvolvimento',
    senderName: 'Marcos Souza',
    senderRole: 'Tech Lead',
    senderAvatar: '👨‍🏫',
    content: '@Scrum Master, o Carlos abriu um Pull Request com 900 linhas alteradas e quase nenhum teste unitário. O time parou para saber se reprovamos ou deixamos passar!',
    dilemmaOptions: [
      {
        id: 'pr_1',
        label: 'Reprove o PR e faça uma sessão de Pair Programming com ele para fatiar o código em partes menores.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 45,
        moraleDelta: +15,
        riskDelta: -2,
        responseReaction: 'Excelente ideia @Scrum Master! O card de Code Review foi fatiado no quadro em 2 tasks menores em Em Desenvolvimento!',
        pedagogicalReason: 'Coaching e colaboração técnica. Fatiamento fino (small batches) reduz o risco de regressão e dissemina conhecimento.',
        scrumGuideReference: 'Scrum Guide: A Definição de Concluído (DoD) cria transparência ao fornecer a todos um entendimento compartilhado de qual trabalho foi concluído.',
        boardEffect: {
          type: 'SPLIT_CARD',
          description: 'Card em Code Review fatiado em 2 partes menores em Em Desenvolvimento com testes',
          splitTargetStatus: 'CODE REVIEW',
          newCards: [
            {
              title: '🧩 [PARTE 1] Regras de Negócio e Endpoints Core',
              description: 'Fatiamento fino focado no domínio principal com cobertura de testes.',
              category: 'BACKEND',
              color: '#3b82f6',
              status: 'EM DESENVOLVIMENTO',
              storyPoints: 3,
            },
            {
              title: '🧩 [PARTE 2] Validações e Testes de Integração',
              description: 'Segunda etapa do fatiamento para garantir estabilidade e qualidade.',
              category: 'BACKEND',
              color: '#8b5cf6',
              status: 'EM DESENVOLVIMENTO',
              storyPoints: 2,
            }
          ]
        }
      },
      {
        id: 'pr_2',
        label: 'Deixe passar desta vez para não estourar a estimativa da Sprint.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -25,
        moraleDelta: -15,
        riskDelta: +3,
        responseReaction: 'Mergeei... mas @Scrum Master, o card foi pra QA com alerta vermelho de risco de produção.',
        pedagogicalReason: 'Relaxar a Definição de Concluído (DoD) para cumprir metas artificiais de prazo é a causa número 1 de falhas em produção.',
        scrumGuideReference: 'Scrum Guide: "Se um item do Product Backlog não atender à Definição de Pronto, ele não poderá ser lançado nem apresentado na Sprint Review."',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Card movido para Homologação (QA) com tag de alto risco',
          fromColumn: 'CODE REVIEW',
          toColumn: 'QA',
          count: 1,
          tagToAdd: '🚨 [SEM TESTES - RISCO]'
        }
      },
      {
        id: 'pr_3',
        label: 'Aprove apenas se ele criar uma task de testes de integração no quadro.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 25,
        moraleDelta: 0,
        riskDelta: +1,
        responseReaction: 'Combinado @Scrum Master, criei a task de testes de integração em A Fazer para ele fazer amanhã!',
        pedagogicalReason: 'Acordo temporário que mantém a cobrança pela qualidade, embora adie a resolução de débito técnico.',
        scrumGuideReference: 'Scrum Guide: A responsabilidade coletiva pela qualidade do incremento pertence a todo o Scrum Team.',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Task de testes automatizados adicionada a A Fazer',
          newCard: {
            title: '🧪 Escrever Testes Automatizados do PR Aprovado',
            description: 'Cobrança de cobertura de testes acordada com o Tech Lead.',
            category: 'BACKEND',
            color: '#f59e0b',
            status: 'TODO',
            storyPoints: 2,
          }
        }
      }
    ]
  },
  {
    id: 'dilemma_qa_bottleneck',
    channelId: 'alertas-bloqueios',
    senderName: 'Júlia Mendes',
    senderRole: 'QA Specialist',
    senderAvatar: '👩‍🔬',
    content: '@Scrum Master SOS! Estou com cards acumulados em Homologação (QA) e a Sprint tá acabando. O time tá travado sem saber como proceder!',
    dilemmaOptions: [
      {
        id: 'qa_1',
        label: 'Pare a entrada de novos cards em Dev: Carlos e Marcos devem ajudar Júlia nos testes (Swarming).',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 45,
        moraleDelta: +15,
        riskDelta: -2,
        responseReaction: 'Nossa, sensacional @Scrum Master! Carlos e Marcos me ajudaram e já validamos e concluímos 2 cards direto para DONE!',
        pedagogicalReason: 'Técnica de Swarming (enxame): "Pare de começar e comece a terminar!" Equipe multidisciplinar ajuda onde está o gargalo (WIP Limit).',
        scrumGuideReference: 'Princípio do Scrum: "Developers são as pessoas no Scrum Team que estão comprometidas em criar qualquer aspecto de um Incremento utilizável."',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Swarming: 2 cards de Homologação (QA) validados e movidos para Concluído (Done)!',
          fromColumn: 'QA',
          toColumn: 'DONE',
          count: 2
        }
      },
      {
        id: 'qa_2',
        label: 'Teste apenas o "caminho feliz" (happy path) e pule os casos extremos para dar tempo.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 15,
        moraleDelta: -10,
        riskDelta: +2,
        responseReaction: 'Testei só o básico e movi 1 card para DONE, mas registrei um débito de testes no Backlog...',
        pedagogicalReason: 'Reduzir a profundidade de testes sem mitigar riscos gera falsas sensações de entrega (Dark Agile).',
        scrumGuideReference: 'Scrum Guide: O Incremento deve ser utilizável e atender aos padrões de qualidade esperados pelos usuários finais.',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: '1 card movido para Done com validação superficial',
          fromColumn: 'QA',
          toColumn: 'DONE',
          count: 1
        }
      },
      {
        id: 'qa_3',
        label: 'Júlia, você terá que fazer serão hoje e amanhã para dar conta.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -30,
        moraleDelta: -30,
        riskDelta: +3,
        responseReaction: 'Isso é injusto @Scrum Master. Os devs passaram a semana toda codificando e jogaram a bomba em cima de mim no último dia.',
        pedagogicalReason: 'Cria silos de responsabilidade (Dev vs QA), incentivando o comportamento de "jogar por cima do muro".',
        scrumGuideReference: 'Scrum Guide: No Scrum não existem sub-equipes ou hierarquias. É uma unidade coesa de profissionais focada em um objetivo por vez.',
        boardEffect: {
          type: 'ADD_TAG_OR_RENAME',
          description: 'Cards de QA marcados com atraso e sobrecarga',
          tagToAdd: '⚠️ [QA SOBRECARREGADA]'
        }
      }
    ]
  },
  {
    id: 'dilemma_skip_retro',
    channelId: 'geral',
    senderName: 'Carlos Silva',
    senderRole: 'Full-Stack Dev',
    senderAvatar: '👨‍💻',
    content: '@Scrum Master, como o prazo da Sprint tá corrido, o que acha da gente pular a Reunião de Retrospectiva essa semana para ganhar tempo? O time aguarda seu veredito!',
    dilemmaOptions: [
      {
        id: 'retro_1',
        label: 'A Retrospectiva é sagrada: é onde inspecionamos nosso processo e melhoramos. Mantenha os 45 minutos com foco objetivo.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 40,
        moraleDelta: +10,
        riskDelta: -1,
        responseReaction: 'Com certeza @Scrum Master! Fizemos a retro e geramos um card de melhoria contínua (Kaizen) já adicionado ao quadro!',
        pedagogicalReason: 'A Retrospectiva da Sprint é o coração da melhoria contínua (Kaizen). Pular a retro gera acúmulo invisível de frustrações e atritos no processo.',
        scrumGuideReference: 'Scrum Guide: O propósito da Retrospectiva da Sprint é planejar maneiras de aumentar a qualidade e a eficácia.',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Ação de melhoria Kaizen da Retrospectiva adicionada a A Fazer',
          newCard: {
            title: '🚀 [MELHORIA KAIZEN] Automatização de Deploy em Staging',
            description: 'Plano de ação pactuado pela equipe durante a Retrospectiva da Sprint.',
            category: 'DEVOPS',
            color: '#10b981',
            status: 'TODO',
            storyPoints: 2,
          }
        }
      },
      {
        id: 'retro_2',
        label: 'Faça uma versão expressa de 15 minutos focada apenas no maior gargalo da semana.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 30,
        moraleDelta: +5,
        riskDelta: 0,
        responseReaction: 'Show @Scrum Master! 15 minutos foram suficientes para focar no problema do ambiente de CI.',
        pedagogicalReason: 'Adaptar o timebox preserva a inspeção sem gerar desespero de prazo na equipe.',
        scrumGuideReference: 'Scrum Guide: Eventos do Scrum são limitados no tempo (timeboxed) para garantir foco e evitar desperdício de tempo.',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Ajuste rápido de processo inserido em A Fazer',
          newCard: {
            title: '🔧 [AJUSTE RÁPIDO] Checklist de Integração Contínua',
            description: 'Ajuste de processo definido no timebox expresso de 15 minutos.',
            category: 'DEVOPS',
            color: '#3b82f6',
            status: 'TODO',
            storyPoints: 1,
          }
        }
      },
      {
        id: 'retro_3',
        label: 'Pula a retro. O que importa no final do dia é código entregue.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -25,
        moraleDelta: -20,
        riskDelta: +2,
        responseReaction: 'Pulamos a retro... mas os atritos de comunicação da última semana continuam se repetindo sem ninguém resolver.',
        pedagogicalReason: 'Sem retrospectiva, o time entra num ciclo cego de repetição de erros e deterioração do moral.',
        scrumGuideReference: 'Três Pilares do Scrum: Transparência, Inspeção e Adaptação. Sem inspeção, a agilidade morre.'
      }
    ]
  },
  {
    id: 'dilemma_critical_bug_friday',
    channelId: 'alertas-bloqueios',
    senderName: 'Marcos Souza',
    senderRole: 'Tech Lead',
    senderAvatar: '👨‍🏫',
    content: '@Scrum Master, são 17h de sexta-feira. Identificamos um bug que ocorre em 2% das compras. O deploy estava agendado para agora. O time parou tudo aguardando sua ordem!',
    dilemmaOptions: [
      {
        id: 'fri_1',
        label: 'Adie o deploy para segunda-feira de manhã. Nunca suba em produção no final de semana com risco conhecido.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 40,
        moraleDelta: +15,
        riskDelta: -3,
        responseReaction: 'Decisão cirúrgica @Scrum Master! Marcamos o card como congelado com segurança até segunda-feira.',
        pedagogicalReason: 'Gestão consciente de risco. Fazer deploy na sexta-feira à tarde sem equipe de prontidão viola as boas práticas de DevOps.',
        scrumGuideReference: 'Scrum Guide: O Incremento deve ser de valor e utilizável. Colocar risco desnecessário em produção fere a integridade do produto.',
        boardEffect: {
          type: 'ADD_TAG_OR_RENAME',
          description: 'Card congelado com segurança para análise na segunda-feira',
          tagToAdd: '🔒 [DEPLOY CONGELADO ATÉ SEGUNDA]'
        }
      },
      {
        id: 'fri_2',
        label: 'Suba para produção com um Feature Flag desativando a tela de compras afetada.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 35,
        moraleDelta: +5,
        riskDelta: -1,
        responseReaction: 'Boa! O card foi entregue em DONE protegido por uma chave de Feature Flag!',
        pedagogicalReason: 'Uso maduro de engenharia de software (Feature Toggles) para desacoplar deploy de release.',
        scrumGuideReference: 'Scrum Guide: Múltiplos Incrementos podem ser criados dentro de uma Sprint e disponibilizados conforme estratégia de entrega.',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Card liberado para Concluído (Done) protegido por Feature Flag',
          fromColumn: 'QA',
          toColumn: 'DONE',
          count: 1,
          tagToAdd: '🚩 [FEATURE FLAG ATIVA]'
        }
      },
      {
        id: 'fri_3',
        label: 'Faça o deploy agora mesmo e deixe o time de plantão no fim de semana.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -30,
        moraleDelta: -35,
        riskDelta: +3,
        responseReaction: 'O bug explodiu no sábado de manhã e o time passou o final de semana apagando incêndio...',
        pedagogicalReason: 'Anti-padrão grave. Destrói finais de semana da equipe e a reputação do produto com clientes reais.',
        scrumGuideReference: 'Princípios Ágeis: Desenvolvimento sustentável e respeito aos indivíduos.',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Novo incidente de produção aberto em A Fazer',
          newCard: {
            title: '🔥 [INCIDENTE PRODUÇÃO] Erro 500 no Checkout em Produção',
            description: 'Falha crítica resultante de deploy apressado na sexta-feira sem cobertura.',
            category: 'BUG',
            color: '#dc2626',
            status: 'TODO',
            storyPoints: 8,
          }
        }
      }
    ]
  },
  {
    id: 'dilemma_architectural_dispute',
    channelId: 'desenvolvimento',
    senderName: 'Carlos Silva',
    senderRole: 'Full-Stack Dev',
    senderAvatar: '👨‍💻',
    content: '@Scrum Master, eu e o Marcos estamos há 3 horas discutindo arquitetura do carrinho (Redis vs Postgres) e o desenvolvimento está totalmente parado. Como destravamos?',
    dilemmaOptions: [
      {
        id: 'arch_1',
        label: 'Definam uma Spike Timeboxed de 2 horas para prototipar e medir latência e complexidade na prática.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 45,
        moraleDelta: +15,
        riskDelta: -2,
        responseReaction: 'Sensacional @Scrum Master! Um card de Spike foi adicionado ao quadro e já vamos rodar o protótipo empírico!',
        pedagogicalReason: 'Empirismo em ação. Decisões arquiteturais devem ser baseadas em experimentos controlados (Spikes), não em debates de ego.',
        scrumGuideReference: 'Scrum Guide: O Scrum baseia-se no empirismo (conhecimento fundamentado na experiência e observação).',
        boardEffect: {
          type: 'CREATE_CARD',
          description: 'Card de Spike técnico adicionado a Em Desenvolvimento para experimento empírico',
          newCard: {
            title: '⚡ [SPIKE ÁGIL] Benchmark: Redis vs Postgres para Carrinho',
            description: 'Experimento controlado de 2h para medir latência e complexidade com dados empíricos.',
            category: 'DATABASE',
            color: '#8b5cf6',
            status: 'EM DESENVOLVIMENTO',
            storyPoints: 2,
          }
        }
      },
      {
        id: 'arch_2',
        label: 'A palavra final em decisões arquiteturais é do Tech Lead Marcos, sigam com Postgres por enquanto.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 20,
        moraleDelta: 0,
        riskDelta: 0,
        responseReaction: 'Decidido pelo critério de autoridade técnica. O time destravou, mas Carlos ficou um pouco chateado.',
        pedagogicalReason: 'Destrava o impasse rapidamente, embora perca a oportunidade de aprendizado colaborativo.',
        scrumGuideReference: 'Scrum Guide: Os Developers são responsáveis por todos os aspectos técnicos da criação do incremento.'
      },
      {
        id: 'arch_3',
        label: 'Tirem no cara ou coroa para acabar logo com essa discussão.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -20,
        moraleDelta: -15,
        riskDelta: +2,
        responseReaction: 'Cara ou coroa para arquitetura de software...? O time sentiu falta de liderança técnica séria.',
        pedagogicalReason: 'Ignora critérios técnicos e demonstra descompromisso com a engenharia.',
        scrumGuideReference: 'Valores do Scrum: Foco e Comprometimento com a excelência técnica.'
      }
    ]
  },

  // ─── DILEMA: Bug Grave Encontrado em QA ────────────────────────────────────
  {
    id: 'dilemma_qa_bug_regression',
    channelId: 'alertas-bloqueios',
    senderName: 'Júlia Mendes',
    senderRole: 'QA Specialist',
    senderAvatar: '👩‍🔬',
    content: '🚨 @Scrum Master URGENTE! Encontrei um bug crítico de SEGURANÇA no card que está em QA: a rota de pagamento NÃO está validando o token JWT. Qualquer usuário pode fazer compras como se fosse outro usuário! Qual é a orientação? O card vai para DONE mesmo assim ou volta para desenvolvimento?',
    dilemmaOptions: [
      {
        id: 'qa_reg_1',
        label: '🔴 Regride o card para "Em Desenvolvimento" imediatamente. Bug de segurança NUNCA vai para produção.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 50,
        moraleDelta: +10,
        riskDelta: -3,
        responseReaction: 'Decisão corretíssima @Scrum Master! Card voltou para Em Desenvolvimento com prioridade máxima. Carlos já está corrigindo a validação JWT! 🛡️',
        pedagogicalReason: 'Integridade do produto é inegociável. Bugs de segurança críticos NUNCA devem ser promovidos para produção, mesmo sob pressão de prazo. Voltar o card ao desenvolvimento é a ação correta.',
        scrumGuideReference: 'Scrum Guide: "A qualidade não diminui." O Definition of Done (DoD) sempre inclui critérios de segurança como requisito não funcional obrigatório.',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Card regredido de QA para Em Desenvolvimento — bug crítico de segurança (JWT)',
          fromColumn: 'QA',
          toColumn: 'EM DESENVOLVIMENTO',
          count: 1,
          tagToAdd: '🔴 [RETORNO QA - BUG SEGURANÇA]'
        }
      },
      {
        id: 'qa_reg_2',
        label: '⚠️ Cria um card de Bug no Backlog e libera o card para DONE com uma nota de risco.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 10,
        moraleDelta: -10,
        riskDelta: +2,
        responseReaction: 'Card marcado como DONE com nota de risco, mas o bug de segurança foi para produção... Isso é um risco técnico e legal sério! 😰',
        pedagogicalReason: 'Em situações de segurança, não existe "nota de risco aceitável". Vulnerabilidades de autenticação NUNCA devem ir para produção — isso pode gerar problemas legais (LGPD/GDPR).',
        scrumGuideReference: 'Scrum Guide: O Incremento deve ser utilizável. Um sistema com falha de segurança crítica não é considerado "Done" de verdade.',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Card promovido para DONE com risco de segurança não resolvido',
          fromColumn: 'QA',
          toColumn: 'DONE',
          count: 1,
          tagToAdd: '⚠️ [RISCO SEGURANÇA EM PRODUÇÃO]'
        }
      },
      {
        id: 'qa_reg_3',
        label: '🚨 Paralisa todo o time para resolver o bug agora mesmo antes de qualquer outra tarefa.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -10,
        moraleDelta: -20,
        riskDelta: 0,
        responseReaction: 'Paralisação total do time gerou pânico! Outros cards em andamento foram abandonados no meio e o contexto de trabalho foi perdido.',
        pedagogicalReason: 'Pausar todo o time desnecessariamente gera mais caos do que valor. O Scrum Master deve proteger o foco dos demais e designar apenas Carlos para a correção.',
        scrumGuideReference: 'Scrum Guide: O Scrum Master serve o time removendo impedimentos de forma cirúrgica, sem criar novos caos desnecessários.'
      }
    ]
  },

  // ─── DILEMA: PR Reprovado em Code Review ───────────────────────────────────
  {
    id: 'dilemma_pr_rejected_code_review',
    channelId: 'desenvolvimento',
    senderName: 'Marcos Souza',
    senderRole: 'Tech Lead',
    senderAvatar: '👨‍🏫',
    content: '@Scrum Master, reprovei o PR do checkout no Code Review. O Carlos não escreveu nenhum teste unitário, os nomes das funções são confusos e tem código duplicado em 3 lugares. Pelo nosso DoD, isso não pode avançar para QA. O que fazemos?',
    dilemmaOptions: [
      {
        id: 'pr_rej_1',
        label: '✅ Justo. Rejeitar o PR e regredir o card para "Em Desenvolvimento" com feedback detalhado para Carlos.',
        approachType: 'SERVANT_LEADERSHIP',
        xpReward: 45,
        moraleDelta: +5,
        riskDelta: -2,
        responseReaction: 'Excelente! O card voltou para Em Desenvolvimento com feedback construtivo. Carlos está refatorando e vai aprender muito com isso! O DoD foi respeitado ✅',
        pedagogicalReason: 'O Definition of Done (DoD) é um contrato de qualidade do time. Aprovação de PR sem testes viola o DoD e acumula dívida técnica que será paga com juros no futuro.',
        scrumGuideReference: 'Scrum Guide: "O Definition of Done cria transparência ao fornecer a todos um entendimento compartilhado de que trabalho foi concluído como parte do Incremento."',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'PR reprovado — card regredido de Code Review para Em Desenvolvimento com feedback de qualidade',
          fromColumn: 'CODE REVIEW',
          toColumn: 'EM DESENVOLVIMENTO',
          count: 1,
          tagToAdd: '🔄 [PR REPROVADO - REFATORAR]'
        }
      },
      {
        id: 'pr_rej_2',
        label: '⚡ Aprove o PR assim mesmo para não atrasar a entrega. Testes podem ser adicionados depois.',
        approachType: 'ANTI_PATTERN_COMMAND',
        xpReward: -15,
        moraleDelta: -10,
        riskDelta: +2,
        responseReaction: 'Card avançou sem qualidade... "Depois" raramente chega. A dívida técnica acumulou e em 2 sprints vai ser o dobro do esforço para refatorar. 😕',
        pedagogicalReason: 'Anti-padrão clássico de "quebrar o DoD por prazo". Testes não são opcionais — são o seguro contra regressões futuras. Toda aprovação sem testes é uma bomba-relógio.',
        scrumGuideReference: 'Scrum Guide: "A qualidade não diminui" — a pressão de entrega nunca justifica quebrar o Definition of Done.',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Card aprovado sem qualidade — avança para QA com risco alto',
          fromColumn: 'CODE REVIEW',
          toColumn: 'QA',
          count: 1,
          tagToAdd: '💣 [SEM TESTES - DÍVIDA TÉCNICA]'
        }
      },
      {
        id: 'pr_rej_3',
        label: '🤝 Organize um Mob Programming de 1h: Marcos e Carlos refatoram juntos o código antes de resubmeter.',
        approachType: 'PRAGMATIC_TRADEOFF',
        xpReward: 40,
        moraleDelta: +15,
        riskDelta: -1,
        responseReaction: 'Mob Programming foi um sucesso! Carlos aprendeu padrões de teste com Marcos, o código ficou muito melhor e o PR foi aprovado em 1h! 🎓',
        pedagogicalReason: 'Mob Programming (toda a equipe no mesmo problema) é uma técnica poderosa para transferência de conhecimento e qualidade. Transforma a situação em aprendizado coletivo.',
        scrumGuideReference: 'Valores do Scrum: Respeito e Abertura. O time aprende junto e cresce junto — isso é agilidade genuína.',
        boardEffect: {
          type: 'MOVE_CARDS',
          description: 'Mob Programming realizado — card regrediu para Dev com aprendizado colaborativo',
          fromColumn: 'CODE REVIEW',
          toColumn: 'EM DESENVOLVIMENTO',
          count: 1,
          tagToAdd: '🎓 [MOB PROGRAMMING - QUALIDADE]'
        }
      }
    ]
  }
];

export const TEAM_CASUAL_MESSAGES: { agentName: string; role: string; avatar: string; channelId: 'geral' | 'desenvolvimento'; text: string }[] = [
  {
    agentName: 'Carlos Silva',
    role: 'Full-Stack Dev',
    avatar: '👨‍💻',
    channelId: 'desenvolvimento',
    text: 'Acabei de rodar o linter e o build passou sem nenhum warning! Código limpo é vida ✨'
  },
  {
    agentName: 'Marcos Souza',
    role: 'Tech Lead',
    avatar: '👨‍🏫',
    channelId: 'desenvolvimento',
    text: 'Configurei cache no Redis pro endpoint de catálogo. A latência caiu de 450ms pra 18ms 🚀'
  },
  {
    agentName: 'Júlia Mendes',
    role: 'QA Specialist',
    avatar: '👩‍🔬',
    channelId: 'geral',
    text: 'Passando aqui pra lembrar: quem não testa na máquina local antes de subir pra Staging vai pagar o café da sexta-feira! ☕😅'
  },
  {
    agentName: 'Ana Oliveira',
    role: 'Product Owner',
    avatar: '👩‍💼',
    channelId: 'geral',
    text: 'Feedback dos usuários beta no teste de usabilidade: eles amaram o fluxo de pagamento em 1 clique! Parabéns time 🎉'
  },
  {
    agentName: 'Carlos Silva',
    role: 'Full-Stack Dev',
    avatar: '👨‍💻',
    channelId: 'desenvolvimento',
    text: 'Subindo migração de banco de dados para os novos campos do pedido. Sem downtime!'
  }
];
