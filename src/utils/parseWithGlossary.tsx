import React from 'react';
import { GLOSSARY_MAP, GLOSSARY } from '../data/glossary';
import { GlossaryTerm } from '../components/GlossaryTerm';

/**
 * Lista de siglas e termos curtos (<= 3 caracteres) que só devem
 * ser destacados se estiverem em maiúsculas (ex: "PR", "QA", "PO", "JWT", "API", "SM").
 * Isso evita que palavras portuguesas ou inglesas como "para", "pra", "por" ou "pr" minúsculo
 * ativem o termo por engano.
 */
const ACRONYMS_SET = new Set<string>();

for (const entry of GLOSSARY) {
  if (entry.term.length <= 3 && entry.term === entry.term.toUpperCase()) {
    ACRONYMS_SET.add(entry.term);
  }
  for (const alias of entry.aliases ?? []) {
    if (alias.length <= 3 && alias === alias.toUpperCase()) {
      ACRONYMS_SET.add(alias);
    }
  }
}

/**
 * Recebe uma string de texto e retorna um array de React nodes onde
 * todas as ocorrências de termos do glossário são substituídas pelo
 * componente <GlossaryTerm> clicável.
 *
 * Utiliza regex com delimitação de fronteira compatível com acentuação em português
 * e garante que siglas curtas (ex: PR, QA, PO, JWT) só casem quando estiverem
 * isoladas e em MAIÚSCULAS, nunca capturando pedaços de palavras (ex: "pronto", "para", "comprar").
 */
export function parseWithGlossary(text: string, keyPrefix: string = 'gl'): React.ReactNode[] {
  if (!text) return [text];

  // Ordena por comprimento decrescente para dar prioridade a termos compostos
  const allTerms = Array.from(GLOSSARY_MAP.keys()).sort((a, b) => b.length - a.length);
  const escaped = allTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // Regex que reconhece fronteiras considerando caracteres Unicode/latinos
  // (?<![\p{L}\p{N}]) e (?![\p{L}\p{N}]) garantem que o termo não seja prefixo, sufixo ou infixo de outra palavra
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'giu');

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let matchCount = 0;

  while ((match = pattern.exec(text)) !== null) {
    const matchStart = match.index;
    const matchedText = match[0];
    const matchEnd = matchStart + matchedText.length;

    // Se for sigla curta (ex: PR, QA, PO, SM, JWT, API, DoD, DoR, WIP):
    // só aceita se estiver em maiúsculas (ou exatamente no casing do termo curto)
    if (ACRONYMS_SET.has(matchedText.toUpperCase())) {
      // Se no texto veio em minúsculas (ex: "pr"), descarta e mantém texto normal
      if (matchedText !== matchedText.toUpperCase()) {
        continue;
      }
    }

    // Adiciona texto normal que estava antes do match
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    const entry = GLOSSARY_MAP.get(matchedText.toLowerCase());

    if (entry) {
      parts.push(
        <GlossaryTerm
          key={`${keyPrefix}_${matchCount++}_${matchStart}`}
          entry={entry}
          displayText={matchedText}
        />
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = matchEnd;
  }

  // Adiciona o restante do texto após o último match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
