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
