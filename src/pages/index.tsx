import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

// export async function getServerSideProps(){
//   const response = await fetch('http://localhost:3333/episodes');
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  menbers: string;
  duration: number;
  durationAsString: string;
  url: string;
  published_at: string;
}
type HomeProps = {
  // episodes: Array<Episode>;
  episodes: Episode[];
}

export default function Home(props: HomeProps){
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      ur: episode.file.url,
    };
  })
  
  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
