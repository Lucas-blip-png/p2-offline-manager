import { useEffect, useState } from 'react';
import { Redirect, Route, useParams } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import {
  IonApp, IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonContent, IonHeader, IonNote, IonPage, IonRefresher, IonRefresherContent,
  IonRouterOutlet, IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { Artigo, buscarArtigo, listarArtigos, preBaixar } from './news';

// Estado da conexão a partir de navigator.onLine + eventos online/offline.
const useOnline = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    addEventListener('online', on);
    addEventListener('offline', off);
    return () => { removeEventListener('online', on); removeEventListener('offline', off); };
  }, []);
  return online;
};

const AvisoOffline = () =>
  useOnline() ? null : (
    <IonToolbar color="warning">
      <IonTitle size="small">Modo Offline: exibindo conteúdo salvo</IonTitle>
    </IonToolbar>
  );

const Cabecalho = ({ titulo, voltar }: { titulo: string; voltar?: boolean }) => (
  <IonHeader>
    <IonToolbar color="primary">
      {voltar && <IonButtons slot="start"><IonBackButton defaultHref="/" /></IonButtons>}
      <IonTitle>{titulo}</IonTitle>
    </IonToolbar>
    <AvisoOffline />
  </IonHeader>
);

// Algumas fontes bloqueiam hotlink (HTTP 403): esconde a imagem em vez de mostrar ícone quebrado.
const semImagem = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; };

const data = (iso: string) => new Date(iso).toLocaleString('pt-BR');

const Lista = () => {
  const [artigos, setArtigos] = useState<Artigo[]>();
  const [erro, setErro] = useState('');
  const [tempo, setTempo] = useState<number>();

  const carregar = async () => {
    const t0 = performance.now();
    try {
      const a = await listarArtigos();
      setTempo(Math.round(performance.now() - t0));
      setArtigos(a);
      setErro('');
      preBaixar(a);
    } catch {
      setErro('Sem conexão e sem notícias salvas ainda. Abra o app uma vez com internet.');
    }
  };
  useEffect(() => { carregar(); }, []);

  return (
    <IonPage>
      <Cabecalho titulo="Offline Manager" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(e) => carregar().then(() => e.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>
        {tempo !== undefined && <IonNote className="ion-padding">Lista carregada em {tempo} ms</IonNote>}
        {erro && <IonText color="danger"><p className="ion-padding">{erro}</p></IonText>}
        {!artigos && !erro && <div className="ion-text-center ion-padding"><IonSpinner /></div>}
        {artigos?.map((a) => (
          <IonCard key={a.id} routerLink={`/artigo/${a.id}`}>
            <img src={a.image_url} alt="" loading="lazy" onError={semImagem} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            <IonCardHeader>
              <IonCardSubtitle>{a.news_site} · {data(a.published_at)}</IonCardSubtitle>
              <IonCardTitle style={{ fontSize: 18 }}>{a.title}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

const Detalhe = () => {
  const { id } = useParams<{ id: string }>();
  const [a, setA] = useState<Artigo>();
  const [erro, setErro] = useState(false);
  useEffect(() => { buscarArtigo(id).then(setA, () => setErro(true)); }, [id]);

  return (
    <IonPage>
      <Cabecalho titulo="Artigo" voltar />
      <IonContent>
        {erro && <IonText color="danger"><p className="ion-padding">Artigo não disponível offline.</p></IonText>}
        {!a && !erro && <div className="ion-text-center ion-padding"><IonSpinner /></div>}
        {a && (
          <IonCard>
            <img src={a.image_url} alt="" onError={semImagem} style={{ width: '100%' }} />
            <IonCardHeader>
              <IonCardSubtitle>{a.news_site} · {data(a.published_at)}</IonCardSubtitle>
              <IonCardTitle>{a.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{a.summary}</p>
              <p><a href={a.url} target="_blank" rel="noreferrer">Fonte original</a></p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Lista} />
        <Route path="/artigo/:id" component={Detalhe} />
        <Redirect to="/" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
