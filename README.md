# Appyon · Auraly — Love Palm Reading

Teste prático Appyon (Desafio 2). Uma feature inédita para o **Auraly**: leitura de mão amorosa comprada e conduzida dentro de um chat com a **Master Aura**, do convite na Home até o resultado personalizado e o histórico.

**🔗 Link público:** https://appyon-auraly.vercel.app (sem login; melhor em tela de celular ou com o DevTools em modo mobile)

**📦 Repositório:** https://github.com/bcalisson02/appyon-auraly

React Native · Expo SDK 58 · TypeScript (strict) · expo-router · dados e IA 100% mockados.

---

## Como rodar

Pré-requisitos: Node 20+ e npm. Para celular, o app **Expo Go** (todas as bibliotecas usadas fazem parte do Expo Go, não é preciso build nativo).

```bash
npm install
npx expo start          # QR code para Expo Go, "w" abre no navegador
```

| Script | O que faz |
|---|---|
| `npm run web` | abre direto no navegador |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (config Expo) |
| `npm run format` | Prettier em `src/` |
| `npm run export:web` | build estático em `dist/` (`npx expo export -p web`) |

### Publicar na web

```bash
npx expo export -p web   # gera dist/
vercel deploy --prod     # usa vercel.json (build, pasta dist, rewrite de SPA e cache)
```

`app.json` usa `web.output: "single"` (SPA) e o `vercel.json` reescreve todas as rotas para `index.html`, então links diretos como `/auraly/chat` funcionam. Para Netlify, o equivalente é `publish = "dist"` com um redirect `/* /index.html 200`.

---

## Roteiro de teste (≈2 min)

1. **Home** → card "Love Palm Reading" → **Start**.
2. **Chat** → "Read my palm" (−15 créditos) → "My right hand" (ou left: tudo espelha) → **Open camera**.
3. **Scan** → espere alinhar (2 s) → toque no obturador → linhas desenhadas uma a uma → **Send to Master Aura**.
4. Quatro cartões de linha (**Next line**) → **Reveal my archetype** → "The Devoted Flame".
5. Faça perguntas: escolha a linha (Heart/Head/Life/Fate) e toque uma sugestão ou digite. A 1ª pergunta traz o lembrete de domingo; a 10ª traz o upsell (+10 perguntas por 5 créditos).
6. **Open my full reading** → toque nos rótulos da palma → **Ask Aura about this** (volta ao chat com contexto).
7. Botão de grade no chat → **Readings** → **Conversations** (o histórico antigo abre a transcrição somente leitura).

**Controles de demo:** pressione e segure o selo de créditos (Home ou chat) para abrir o painel que simula créditos baixos, câmera negada, mão não detectada e "Start over".

---

## Estrutura

```
src/
  app/                                rotas (expo-router)
    _layout.tsx                       fontes, splash, tema, coluna de celular no web
    index.tsx                         launcher → /auraly (Risely entra aqui como irmão)
    auraly/
      _layout.tsx                     Stack do Auraly + Toast global
      (tabs)/_layout.tsx, index.tsx   Tabs com TabBar flutuante · Home
      chat.tsx                        Master Aura (thread único da leitura)
      scan.tsx                        Palm scan (modal fullscreen)
      reading.tsx                     Full reading ("Your Love Palm")
      readings.tsx                    Readings (hub de histórico)
      conversations.tsx               Conversations
      conversation/[id].tsx           transcrição read-only (mock)
      demo.tsx                        controles de demo (modal)
  components/FadeMask(.web).tsx       fade das bordas da lista (MaskedView / CSS mask)
  features/auraly/
    theme.ts                          tokens (cores, tipografia, raios, sombras)
    assets.ts                         registro de imagens
    navigation.ts                     helpers de navegação
    data/lines.ts                     linhas, textos, geometria (PATHS, LBL, HAND)
    data/replies.ts                   "IA" mockada (tabela de regex + fallback por linha)
    data/conversations.ts             histórico mockado
    store/                            Zustand + AsyncStorage (estado e ações) · toast
    components/                       primitives, cards, media, PalmView, TabBar, Toast…
      chat/                           mensagens, header, composer
      scan/                           guia da mão, feixe, obturador, badge
assets/auraly/                        ilustrações do handoff (WebP)
```

O Risely (Desafio 1) entra como `src/app/risely/` + `src/features/risely/`, reaproveitando `src/components/`, sem tocar no Auraly.

---

## Decisões de UX

- **O chat é o produto.** Oferta, compra, escolha da mão, câmera, as quatro linhas, o arquétipo e as perguntas vivem em **um único thread**. A leitura é uma conversa com a Master Aura, não um formulário com um chat preso no fim; isso reforça a persona e o valor dos créditos.
- **Revelação em etapas.** Cada linha chega como um cartão próprio, com perguntas sugeridas *daquela* linha; o próximo passo é sempre um único botão branco. O arquétipo é o clímax e abre o resultado completo.
- **Perguntas com contexto.** Depois do arquétipo, o seletor Heart/Head/Life/Fate define o contexto. O placeholder muda ("Ask about your head line") e a resposta usa a linha escolhida. "Ask Aura about this" no resultado leva esse contexto de volta ao chat.
- **Monetização honesta.** O preço aparece antes da compra (15 créditos, saldo visível), o contador "N left" fica no composer e o upsell só aparece quando as 10 perguntas acabam. Sem créditos suficientes nada é cobrado e a Aura explica.
- **Retenção.** Lembrete de "guidance" no domingo (no chat e no resultado), comparar palmas com parceiro, re-scan com data, hub de Readings e histórico de Conversations. Tudo fica salvo e sobrevive a reload.
- **Scan que dá confiança.** Contorno pontilhado guia a mão, a foto "encaixa" quando alinha, as linhas são desenhadas uma a uma com o progresso nomeado ("Tracing your heart line"). Fechar no meio volta ao início e nunca mostra "Completed".
- **Acessibilidade.** Rótulos e papéis nos controles, live regions no status ("Typing…", progresso do scan) e `prefers-reduced-motion` respeitado (sem feixe, linhas desenhadas na hora).

## Decisões de arquitetura

- **expo-router (tabs + stack).** `auraly/_layout` é um Stack; `(tabs)` é o primeiro screen; chat, resultado e histórico são push; o scan é `fullScreenModal`. As abas fora do protótipo mostram um toast (como define o handoff).
- **Um chat só na pilha.** `nav.chat()` usa `router.dismissTo`: volta ao chat que já está na pilha (ou substitui a tela atual), em vez de empilhar cópias ao alternar chat ⇄ resultado ⇄ histórico.
- **Estado.** Zustand com `persist` em AsyncStorage (no web, localStorage). As mensagens são uma *discriminated union* `ChatItem`; cada tipo tem seu componente e o switch é exaustivo no TypeScript. Seletores puros (`questionsLeft`, `hasFinishedReading`…) são compartilhados entre telas.
- **IA mockada robusta.** `auraSays` grava a resposta "sendo digitada" no estado (`pending`) e só a anexa após 0,9–1,8 s. Como `pending` é persistido, um reload durante o "Typing…" entrega a resposta em vez de deixar o chat travado.
- **Scan com estado local.** A máquina `idle → aligned → run → done` (+ `failed`) é um `useReducer` na própria tela. Fechar o modal desmonta tudo e reseta naturalmente; o store só recebe o resultado (`sendScanToAura`).
- **Palma em SVG.** `PalmView` (foto + linhas + rótulos) é reutilizado no scan, na miniatura do chat e no resultado. As linhas são desenhadas com `strokeDashoffset` (Reanimated `useAnimatedProps`), usando o comprimento real de cada bézier calculado por amostragem. A mão esquerda espelha foto e linhas, e os rótulos usam âncoras espelhadas para o texto continuar legível.
- **Animações.** Reanimated: animações CSS (entrada das mensagens, pontos digitando, pulso do guia, feixe do scan) e shared values (encaixe da foto, linhas). As *layout animations* de entrada foram evitadas de propósito: no web elas tornam o item `position: absolute` e quebram o fluxo da lista.
- **Paridade web.** `FadeMask` usa MaskedView no nativo e CSS `mask-image` no web (o MaskedView não tem implementação web). Camadas de blur ficam atrás do conteúdo, e no desktop o app roda numa coluna de 390 pt, o mesmo frame do design (iPhone 14/15).
- **Desempenho.** As ilustrações foram reencodadas em WebP (19 MB → 1,9 MB) sem alterar a arte. O blur real fica só em tab bar, composer e tags; os balões usam vidro translúcido.
- **Design tokens.** Tudo vem de `theme.ts` (cores, tipos Instrument Serif/Geist via `@expo-google-fonts`, raios, sombras). Não há hex soltos nas telas.

## Edge cases cobertos

| Caso | Como testar |
|---|---|
| Créditos insuficientes (leitura ou +10 perguntas) | Demo → "Set to 10" → Start over → "Read my palm" |
| Permissão de câmera negada (→ "Allow camera" / "Use a sample photo") | Demo → "Camera permission denied" |
| Mão não detectada (6 s → dica + "Try again", nunca "Completed") | Demo → "Hand not detected", ou segure o obturador |
| Scan interrompido | Feche durante "Scanning": volta a `idle` e "Open camera" continua ativo |
| Limite de perguntas | Composer bloqueado, placeholder "Add more questions above", upsell por pacote |
| Entrada vazia / Aura digitando | Enviar não faz nada; sugestões somem enquanto ela digita |
| Reentrada | Leitura concluída: Home mostra "Open" → Full reading; o thread é restaurado |
| Telas pequenas (≤ 360 pt) | Viewfinder `min(340, largura − 40)` (e limitado pela altura), grades 2 col. e seletor 4 col. mantidos |

## Fora do escopo (intencional)

Backend, autenticação, checkout real e IA real (pedido do teste). A câmera só pede permissão; o scan usa a foto de exemplo do handoff. As abas Journey/Insights/Community/Profile, Birth Chart e Daily horoscope pertencem ao app completo e respondem com toast.

As ilustrações são referências fornecidas no handoff (stand-ins para o teste), não assets oficiais do Auraly.
