export class TrelloDomAdapter {
  isBoardPage(): boolean {
    return (
      window.location.pathname.startsWith('/b/') ||
      !!document.querySelector('[data-testid="board-name-display"]') ||
      !!document.querySelector('.board-main-content') ||
      !!document.querySelector('[data-board-id]') ||
      !!document.querySelector('#board') ||
      !!document.querySelector('.board-canvas')
    );
  }

  // ─── Listas ───────────────────────────────────────────────────────────────
  findAllLists(): HTMLElement[] {
    const byTestId = document.querySelectorAll<HTMLElement>('[data-testid="list"]');
    if (byTestId.length) return Array.from(byTestId);
    return Array.from(document.querySelectorAll<HTMLElement>('li.list, div.js-list, [data-list-id], [class*="list-wrapper"] > [class*="list"]'));
  }

  getListName(listEl: HTMLElement): string {
    const candidates = listEl.querySelectorAll<HTMLElement>(
      '[data-testid="list-header-name-textarea"], textarea.list-header-name, h2.list-header-name, .list-name, textarea'
    );
    for (const el of candidates) {
      const text = el.textContent?.trim() || (el as HTMLInputElement).value?.trim();
      if (text) return text;
    }
    return '';
  }

  getAllListNames(): string[] {
    return this.findAllLists().map(l => this.getListName(l)).filter(Boolean);
  }

  findList(name: string): HTMLElement | null {
    const target = name.trim().toUpperCase();
    return this.findAllLists().find(l => {
      const current = this.getListName(l).trim().toUpperCase();
      return current === target || current.startsWith(target);
    }) ?? null;
  }

  closeAnyOpenComposers() {
    for (let i = 0; i < 2; i++) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
    }
  }

  // ─── Botão "Adicionar uma lista" ──────────────────────────────────────────
  findAddListButton(): HTMLElement | null {
    const byTestId = document.querySelector<HTMLElement>(
      '[data-testid="list-composer-button"], [data-testid="list-composer-add-list-button"], button.list-composer-button'
    );
    if (byTestId && byTestId.offsetParent !== null) return byTestId;

    for (const sel of ['.js-add-list', '[data-action="add-list"]', 'a.open-add-list', '.list-composer-button']) {
      const el = document.querySelector<HTMLElement>(sel);
      if (el && el.offsetParent !== null) return el;
    }

    const all = document.querySelectorAll<HTMLElement>('button, a, [role="button"], div, span');
    for (const el of Array.from(all)) {
      if (el.offsetParent === null) continue;
      const text = el.innerText?.trim() || el.textContent?.trim() || '';
      if (
        (text.includes('Adicionar uma lista') || text.includes('Add a list') || text.includes('Adicionar outra lista') || text.includes('Add another list')) &&
        el.children.length <= 2
      ) {
        return el;
      }
    }
    return null;
  }

  findListNameInput(): HTMLInputElement | HTMLTextAreaElement | null {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      const el = active as HTMLInputElement | HTMLTextAreaElement;
      if (
        !el.closest('nav') &&
        !el.closest('[class*="search"]') &&
        !el.closest('[data-testid="header-search-input"]') &&
        !el.closest('[data-testid="list-header"]') &&
        !el.classList.contains('list-header-name-textarea')
      ) {
        return el;
      }
    }

    const selectors = [
      'textarea[data-testid="list-name-textarea"]',
      'textarea[data-testid="list-composer-name-input"]',
      'input[data-testid="list-composer-list-name-input"]',
      'input[data-testid="list-composer-name-input"]',
      '[data-testid="list-composer"] textarea',
      '[data-testid="list-composer"] input',
      'form.list-composer textarea',
      'form.list-composer input',
      '.list-composer textarea',
      '.list-composer input',
      '[class*="listComposer"] textarea',
      '[class*="listComposer"] input',
      'textarea.list-name-input',
      'input.list-name-input',
      'input.js-list-name-input',
    ];
    for (const sel of selectors) {
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(sel);
      if (el && el.offsetParent !== null) return el;
    }

    const elements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('textarea, input[type="text"], input:not([type])');
    for (const el of Array.from(elements)) {
      if (el.offsetParent === null) continue;
      const ph = (el.placeholder || el.getAttribute('aria-label') || '').toLowerCase();
      if (
        (ph.includes('lista') || ph.includes('list') || ph.includes('título') || ph.includes('title')) &&
        !el.closest('[data-testid="list-header"]') &&
        !el.classList.contains('list-header-name-textarea')
      ) {
        return el;
      }
    }
    return null;
  }

  async waitForListNameInput(timeoutMs = 3000): Promise<HTMLInputElement | HTMLTextAreaElement | null> {
    const immediate = this.findListNameInput();
    if (immediate) return immediate;

    return new Promise(resolve => {
      let timer: ReturnType<typeof setTimeout>;
      const observer = new MutationObserver(() => {
        const found = this.findListNameInput();
        if (found) {
          observer.disconnect();
          clearTimeout(timer);
          resolve(found);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      timer = setTimeout(() => {
        observer.disconnect();
        resolve(this.findListNameInput());
      }, timeoutMs);
    });
  }

  findAddListSubmitButton(): HTMLElement | null {
    const selectors = [
      '[data-testid="list-composer-add-list-button"]',
      '.list-composer [type="submit"]',
      '[class*="listComposer"] [type="submit"]',
      'input[value="Add list"]',
      'button[type="submit"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector<HTMLElement>(sel);
      if (el && el.offsetParent !== null) return el;
    }
    const btns = document.querySelectorAll<HTMLElement>('button, input[type="submit"]');
    for (const b of Array.from(btns)) {
      if (b.offsetParent === null) continue;
      const t = (b.textContent || (b as HTMLInputElement).value || '').toLowerCase();
      if (t.includes('adicionar lista') || t.includes('add list')) return b;
    }
    return null;
  }

  // ─── Botão "+ Adicionar um cartão" dentro de uma lista ────────────────────
  findAddCardButton(listElement: HTMLElement): HTMLElement | null {
    const selectors = [
      '[data-testid="list-add-card-button"]',
      '.open-card-composer',
      '.js-add-card',
      'a.list-add-card',
      'button.list-add-card-button',
    ];
    for (const sel of selectors) {
      const el = listElement.querySelector<HTMLElement>(sel);
      if (el && el.offsetParent !== null) return el;
    }
    const btns = listElement.querySelectorAll<HTMLElement>('button, a, [role="button"]');
    for (const b of Array.from(btns)) {
      if (b.offsetParent === null) continue;
      const t = (b.textContent || '').trim().toLowerCase();
      if (t.includes('adicionar um cartão') || t.includes('adicionar cartão') || t.includes('add a card') || t.includes('add card')) {
        return b;
      }
    }
    return null;
  }

  // Encontra input ou textarea do card composer (especificamente o campo "Insira um título ou cole um link")
  findCardComposerInput(listElement: HTMLElement): HTMLTextAreaElement | HTMLInputElement | null {
    // 1. Selector exato do Trello para composer de cartões
    const primary = listElement.querySelector<HTMLTextAreaElement | HTMLInputElement>(
      'textarea[data-testid="list-card-composer-textarea"], input[data-testid="list-card-composer-textarea"], [data-testid="list-card-composer"] textarea, [data-testid="list-card-composer"] input, .card-composer-container textarea, textarea.list-card-composer-textarea'
    );
    if (primary && primary.offsetParent !== null) return primary;

    // 2. Busca por placeholder ("Insira um título ou cole um link", "Enter a title or paste a link", etc.)
    const candidates = listElement.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>('textarea, input[type="text"], input:not([type])');
    for (const el of Array.from(candidates)) {
      if (el.offsetParent === null) continue;
      if (el.closest('[data-testid="list-header"]') || el.classList.contains('list-header-name-textarea')) continue;

      const ph = (el.placeholder || el.getAttribute('aria-label') || '').toLowerCase();
      if (ph.includes('título') || ph.includes('title') || ph.includes('link') || ph.includes('cartão') || ph.includes('card')) {
        return el;
      }
    }

    // 3. Fallback: qualquer textarea na lista fora do header
    for (const el of Array.from(candidates)) {
      if (el.offsetParent !== null && !el.closest('[data-testid="list-header"]') && !el.classList.contains('list-header-name-textarea')) {
        return el;
      }
    }
    return null;
  }

  async waitForCardComposerInput(listElement: HTMLElement, timeoutMs = 3000): Promise<HTMLTextAreaElement | HTMLInputElement | null> {
    const immediate = this.findCardComposerInput(listElement);
    if (immediate) return immediate;

    return new Promise(resolve => {
      let timer: ReturnType<typeof setTimeout>;
      const observer = new MutationObserver(() => {
        const found = this.findCardComposerInput(listElement);
        if (found) {
          observer.disconnect();
          clearTimeout(timer);
          resolve(found);
        }
      });
      observer.observe(listElement, { childList: true, subtree: true });
      timer = setTimeout(() => {
        observer.disconnect();
        resolve(this.findCardComposerInput(listElement));
      }, timeoutMs);
    });
  }

  findCardComposerSaveButton(listElement: HTMLElement): HTMLElement | null {
    const selectors = [
      '[data-testid="list-card-composer-add-card-button"]',
      '.card-composer-container [type="submit"]',
      '.js-add-card[type="submit"]',
      'button[type="submit"]',
    ];
    for (const sel of selectors) {
      const el = listElement.querySelector<HTMLElement>(sel);
      if (el && el.offsetParent !== null && !el.closest('[data-testid="list-header"]')) return el;
    }
    const btns = listElement.querySelectorAll<HTMLElement>('button, input[type="submit"]');
    for (const b of Array.from(btns)) {
      if (b.offsetParent === null || b.closest('[data-testid="list-header"]')) continue;
      const t = (b.textContent || (b as HTMLInputElement).value || '').toLowerCase();
      if (t.includes('adicionar cartão') || t.includes('adicionar cartao') || t.includes('add card') || t.includes('adicionar')) {
        return b;
      }
    }
    return null;
  }

  // ─── TASS Cards ───────────────────────────────────────────────────────────
  findTassCards(): HTMLElement[] {
    const allCards = document.querySelectorAll<HTMLElement>(
      '[data-testid="card-name"], .card-title, .list-card-title, [class*="card-title"]'
    );
    return Array.from(allCards)
      .filter(c => c.textContent?.includes('[TASS]'))
      .map(c => c.closest<HTMLElement>('[data-testid="trello-card"], .list-card, a.list-card') ?? c)
      .filter(Boolean) as HTMLElement[];
  }

  findTassCardsInList(listEl: HTMLElement): HTMLElement[] {
    const cards = listEl.querySelectorAll<HTMLElement>(
      '[data-testid="trello-card"], .list-card, a.list-card'
    );
    return Array.from(cards).filter(c => c.textContent?.includes('[TASS]'));
  }

  // ─── Mover card ───────────────────────────────────────────────────────────
  async moveCardViaDialog(cardEl: HTMLElement, targetListName: string): Promise<boolean> {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    cardEl.click();
    await sleep(800);
    const moveBtn =
      document.querySelector<HTMLElement>('[data-testid="card-back-move-card-button"]') ||
      document.querySelector<HTMLElement>('.js-move-card') ||
      this.findButtonByText('Mover', 'Move');
    if (!moveBtn) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return false;
    }
    moveBtn.click();
    await sleep(500);
    const listLinks = document.querySelectorAll<HTMLElement>(
      '[data-testid="move-card-popover-list-option"], .js-select-list-item, .pop-over-list li'
    );
    const link = Array.from(listLinks).find(l =>
      l.textContent?.toUpperCase().includes(targetListName.toUpperCase())
    );
    if (link) {
      link.click();
      await sleep(300);
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return false;
    }
    const confirmBtn =
      document.querySelector<HTMLElement>('[data-testid="move-card-popover-move-button"]') ||
      this.findButtonByText('Mover', 'Move');
    if (confirmBtn) {
      confirmBtn.click();
      await sleep(400);
    }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await sleep(300);
    return true;
  }

  private findButtonByText(...texts: string[]): HTMLElement | null {
    const btns = document.querySelectorAll<HTMLElement>('button, a, [role="button"]');
    for (const b of Array.from(btns)) {
      const t = b.textContent?.trim() || '';
      if (texts.some(txt => t.toUpperCase().includes(txt.toUpperCase()))) return b;
    }
    return null;
  }
}