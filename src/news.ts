// API pública de notícias (sem chave, com CORS): Spaceflight News API v4.
const API = 'https://api.spaceflightnewsapi.net/v4/articles/';

export interface Artigo {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  news_site: string;
  published_at: string;
  url: string;
}

export const listarArtigos = async (): Promise<Artigo[]> => {
  const r = await fetch(`${API}?limit=20`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).results;
};

export const buscarArtigo = async (id: string): Promise<Artigo> => {
  const r = await fetch(`${API}${id}/`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

// Pré-busca de cada artigo e imagem: o Service Worker guarda as respostas,
// então a leitura completa funciona offline mesmo para artigos nunca abertos.
// (new Image() gera request com destination "image", que cai na rota de imagens do SW.)
export const preBaixar = (artigos: Artigo[]) => {
  artigos.forEach((a) => { new Image().src = a.image_url; });
  return Promise.allSettled(artigos.map((a) => fetch(`${API}${a.id}/`)));
};
