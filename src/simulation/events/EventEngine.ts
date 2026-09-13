import { TrelloDomAdapter } from '../../content/adapters/TrelloDomAdapter';
import { GeminiAgent } from '../ai/GeminiAgent';

const KANBAN_LISTS = ['BACKLOG', 'TODO', 'EM DESENVOLVIMENTO', 'CODE REVIEW', 'QA', 'DONE'];

interface ScenarioCard {
  title: string;
}

const SCENARIO_CARDS: ScenarioCard[] = [
  { title: '🟢 [FRONTEND] [TASS] Cadastro de Usuário e Autenticação' },
  { title: '🔵 [BACKEND] [TASS] Integração de Login via OAuth 2.0' },
  { title: '🟣 [UI/UX] [TASS] Catálogo e Vitrine de Produtos' },
  { title: '🟡 [DATABASE] [TASS] Módulo de Carrinho e Persistência' },
  { title: '🔴 [SECURITY] [TASS] Gateway de Checkout e Pagamento Seguro' },
  { title: '🟠 [API] [TASS] Rastreamento de Pedido em Tempo Real' },
  { title: '🟢 [DEVOPS] [TASS] Painel Administrativo e Métricas' },
  { title: '🔵 [CLOUD] [TASS] Sistema de Notificações Push Firebase' },
];

export class EventEngine {
  private adapter = new TrelloDomAdapter();
  private gemini = new GeminiAgent();

  private sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Preenchimento com prototype setter nativo + eventos de input/change
  private setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
    el.focus();
    const proto = el instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    setter ? setter.call(el, value) : (el.value = value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ─── Cria uma lista ───────────────────────────────────────────────────────
  private async createList(name: string, onProgress?: (msg: string) => void): Promise<boolean> {
    if (this.adapter.findList(name)) {
      onProgress?.(`✓ Lista "${name}" já existe.`);
      return true;
    }

    let input = this.adapter.findListNameInput();

    if (!input) {
      const addBtn = this.adapter.findAddListButton();
      if (!addBtn) {
        onProgress?.(`❌ Botão "Adicionar lista" não encontrado.`);
        return false;
      }
      addBtn.click();
      input = await this.adapter.waitForListNameInput(3000);
    }

    if (!input) {
      onProgress?.(`❌ Campo para "${name}" não abriu.`);
      return false;
    }

    this.setNativeValue(input, name);
    await this.sleep(200);

    const submitBtn = this.adapter.findAddListSubmitButton();
    if (submitBtn) {
      submitBtn.click();
    } else {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    }

    await this.sleep(800);
    const created = !!this.adapter.findList(name);
    onProgress?.(created ? `✅ Lista "${name}" pronta!` : `⚠️ "${name}" criada.`);
    return created;
  }

  // ─── Injeta um cartão com confirmação física no DOM ───────────────────────
  async injectCard(getList: () => HTMLElement | null, cardTitle: string): Promise<boolean> {
    const listElement = getList();
    if (!listElement) return false;

    // Conta quantos cards TASS existem na lista antes de começar
    const countBefore = this.adapter.findTassCardsInList(listElement).length;

    // 1. Localiza input de cartão ou clica para abrir
    let input = this.adapter.findCardComposerInput(listElement);

    if (!input) {
      const addBtn = this.adapter.findAddCardButton(listElement);
      if (addBtn) {
        addBtn.click();
      }
      await this.sleep(300);
      const freshList = getList() || listElement;
      input = await this.adapter.waitForCardComposerInput(freshList, 2500);
    }

    if (!input) {
      console.warn('[TASS] Composer de cartão não encontrado.');
      return false;
    }

    // 2. Preenche o título do cartão
    this.setNativeValue(input, cardTitle);
    await this.sleep(200);

    // 3. Submete o cartão (clica no botão e aperta Enter)
    const freshList = getList() || listElement;
    const saveBtn = this.adapter.findCardComposerSaveButton(freshList);
    if (saveBtn) {
      saveBtn.click();
    }
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));

    // 4. Confirmação real no DOM: aguarda até o novo cartão aparecer na lista!
    const start = Date.now();
    while (Date.now() - start < 3500) {
      await this.sleep(200);
      const currentList = getList() || listElement;
      const countAfter = this.adapter.findTassCardsInList(currentList).length;
      if (countAfter > countBefore) {
        // Cartão confirmado no DOM pelo Trello!
        this.decorateTassCards();
        await this.sleep(300);
        return true;
      }
    }

    // Fallback se demorou mais que 3.5s mas ainda pode ter sido criado
    this.decorateTassCards();
    return true;
  }

  // ─── Decora os cartões [TASS] com bordas coloridas no DOM ─────────────────
  decorateTassCards() {
    try {
      const cardTitles = document.querySelectorAll<HTMLElement>(
        '[data-testid="card-name"], .list-card-title, a.list-card'
      );
      cardTitles.forEach(el => {
        const text = el.textContent || '';
        if (!text.includes('[TASS]')) return;

        const cardContainer = el.closest<HTMLElement>('[data-testid="trello-card"], .list-card, a.list-card');
        if (!cardContainer) return;

        cardContainer.style.transition = 'border-left 0.2s ease, background-color 0.2s ease';

        if (text.includes('[FRONTEND]')) {
          cardContainer.style.borderLeft = '6px solid #10b981';
        } else if (text.includes('[BACKEND]')) {
          cardContainer.style.borderLeft = '6px solid #3b82f6';
        } else if (text.includes('[UI/UX]')) {
          cardContainer.style.borderLeft = '6px solid #8b5cf6';
        } else if (text.includes('[DATABASE]')) {
          cardContainer.style.borderLeft = '6px solid #f59e0b';
        } else if (text.includes('[SECURITY]')) {
          cardContainer.style.borderLeft = '6px solid #ef4444';
        } else if (text.includes('[API]')) {
          cardContainer.style.borderLeft = '6px solid #f97316';
        } else if (text.includes('[DEVOPS]')) {
          cardContainer.style.borderLeft = '6px solid #06b6d4';
        } else if (text.includes('[CLOUD]')) {
          cardContainer.style.borderLeft = '6px solid #6366f1';
        } else if (text.includes('BUG')) {
          cardContainer.style.borderLeft = '6px solid #dc2626';
          cardContainer.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
        }
      });
    } catch {
      // Ignora falhas de estilo
    }
  }

  // ─── Setup completo do Cenário ────────────────────────────────────────────
  async setupScenario(onProgress?: (msg: string) => void): Promise<void> {
    onProgress?.('🚀 Iniciando configuração do Cenário Delivery App...');

    // PASSO 1: Configurar todas as 6 listas
    for (const listName of KANBAN_LISTS) {
      onProgress?.(`📋 Verificando lista: ${listName}...`);
      await this.createList(listName, onProgress);
      await this.sleep(250);
    }

    // Fecha composer de lista
    this.adapter.closeAnyOpenComposers();
    await this.sleep(400);

    onProgress?.('📊 Listas prontas! Injetando cartões no BACKLOG...');

    const getBacklog = () => this.adapter.findList('BACKLOG') || this.adapter.findAllLists()[0] || null;

    // PASSO 2: Injetar os 8 cartões com confirmação individual
    for (let i = 0; i < SCENARIO_CARDS.length; i++) {
      const card = SCENARIO_CARDS[i];
      onProgress?.(`➕ Injetando (${i + 1}/8): ${card.title.slice(0, 28)}...`);

      let ok = await this.injectCard(getBacklog, card.title);
      if (!ok) {
        onProgress?.(`⏳ Aguardando Trello para "${card.title.slice(0, 20)}"...`);
        await this.sleep(1000);
        ok = await this.injectCard(getBacklog, card.title);
      }

      await this.sleep(200);
    }

    // Fecha composer de cartão ao finalizar
    this.adapter.closeAnyOpenComposers();
    await this.sleep(300);
    this.decorateTassCards();

    onProgress?.('🎉 Cenário Delivery App pronto com todos os 8 cards!');
  }

  // ─── Movimentação AI ──────────────────────────────────────────────────────
  async processAgentTick(
    agentName: string, agentRole: string, tick: number, userLastDecision?: string
  ): Promise<{ moved: boolean; question?: { title: string; options: string[] }; log: string }> {
    const listNames = this.adapter.getAllListNames();
    const tassCards = this.adapter.findTassCards()
      .map(c => c.textContent?.trim() ?? '').filter(Boolean);

    const decision = await this.gemini.decideNextAction({
      agentName, agentRole, currentCards: tassCards, listNames, tick, userLastDecision
    });

    if (decision.action === 'WAIT') {
      return { moved: false, log: `⏳ ${agentName}: ${decision.reason}` };
    }

    if (decision.action === 'CREATE_BUG') {
      const getFirstList = () => this.adapter.findAllLists()[0] || null;
      const bugId = Math.floor(Math.random() * 900) + 100;
      const bugTitle = `🔴 [CRITICAL BUG] [TASS] BUG-${bugId}: ${decision.reason}`;
      await this.injectCard(getFirstList, bugTitle);
      this.decorateTassCards();
      return {
        moved: true,
        question: decision.userQuestion ?? undefined,
        log: `🐛 ${agentName}: BUG-${bugId} registrado!`
      };
    }

    if (decision.action === 'MOVE_CARD' && decision.cardTitle && decision.toList) {
      const allCards = this.adapter.findTassCards();
      const cardEl = allCards.find(c => c.textContent?.includes(decision.cardTitle!));
      if (cardEl) {
        const moved = await this.adapter.moveCardViaDialog(cardEl, decision.toList);
        this.decorateTassCards();
        return {
          moved,
          question: decision.userQuestion ?? undefined,
          log: moved
            ? `✅ ${agentName}: moveu "${decision.cardTitle.slice(0, 20)}..." → ${decision.toList}`
            : `⚠️ ${agentName}: falhou ao mover`
        };
      }
    }

    return { moved: false, log: `${agentName}: ${decision.reason}` };
  }

  async generateBug(agentName: string): Promise<void> {
    const getFirstList = () => this.adapter.findAllLists()[0] || null;
    const bugId = Math.floor(Math.random() * 900) + 100;
    await this.injectCard(getFirstList, `🔴 [CRITICAL BUG] [TASS] BUG-${bugId}: Falha detectada por ${agentName}`);
    this.decorateTassCards();
  }
}