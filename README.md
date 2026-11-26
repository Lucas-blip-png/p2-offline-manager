# Offline Manager (P2 Front-End, tema 4)

Leitor de notícias PWA (TypeScript + React + Ionic) que funciona sem internet.
Service Worker (Workbox) com pré-cache da interface e Stale-While-Revalidate para a API e as imagens.

## Rodar

```
npm install
npm run build
npm run preview      # abre em http://localhost:4173
```

O Service Worker só funciona no build (`preview`), não no `npm run dev`.

## Demonstração (apresentação)

1. Abra http://localhost:4173 e recarregue uma vez (o SW passa a controlar a página).
2. Veja "Lista carregada em X ms": cai de ~800 ms para ~20 ms.
3. DevTools (F12) > Application > Cache Storage: `noticias-api`, `noticias-imagens`, precache.
4. DevTools > Network > marque **Offline** e recarregue: aparece a faixa amarela "Modo Offline" e as notícias continuam.
5. Abra qualquer artigo, mesmo um que nunca foi aberto: lê offline (pré-busca).
6. Extra: pare o `npm run preview` e recarregue: o app continua abrindo.

## Arquivos

- `vite.config.ts`: configuração do Service Worker (estratégias de cache).
- `src/news.ts`: chamadas à Spaceflight News API e pré-busca.
- `src/App.tsx`: telas (lista e artigo) e aviso de Modo Offline.
- `paper/`: `paper.tex` e `references.bib` para colar no template do Overleaf.

## Roteiro de fala (~5 min)

1. **Problema (30 s):** app de notícia normal morre sem internet, mesmo com as matérias já baixadas. Meu tema: fazer ele funcionar offline.
2. **Stack (30 s):** TypeScript + React + Ionic. Notícias da Spaceflight News API (pública, sem chave).
3. **Como funciona (1 min, mostrar `vite.config.ts`):** um Service Worker fica entre o app e a rede.
   - Interface (HTML/JS/CSS) vai em pré-cache na instalação: abre sem servidor.
   - API e imagens usam **Stale-While-Revalidate**: mostra o cache na hora e atualiza em segundo plano.
4. **Meu diferencial (30 s, mostrar `src/news.ts`):** ao carregar a lista, o app pré-baixa todos os artigos. Dá pra ler offline até o que nunca foi aberto.
5. **Demo (2 min):** passos da seção "Demonstração" acima: tempo caindo (~800 ms → ~20 ms), Cache Storage, Offline + faixa amarela, abrir artigo offline, parar o servidor.
6. **Limitações (30 s):** medido no PC e não no celular; a API só traz o resumo da matéria; algumas imagens são bloqueadas pelo site de origem (403) e o app esconde.
