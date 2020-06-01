import fetch from 'node-fetch'
import config from './config.json'
class HotMovie {
  constructor (rate: number, name: string, url: string, id: string) {
    this.rate = rate
    this.name = name
    this.url = url
    this.id = id
  };

    rate: number;
    name: string;
    url: string;
    id: string;
}
export const fetchHotMovie = async (): Promise<HotMovie[]> => {
  try {
    const result = await fetch(`https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=${config.movie_limit}&page_start=0`, {
      headers: config.headers,
      method: 'GET'
    })
    return (await result.json()).subjects.map((it: any) => new HotMovie(it.rate, it.title, it.url, it.id))
  } catch (error) {
    console.log(`fetch url：https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=${config.movie_limit}&page_start=0`)
    console.error(error)
    return []
  }
}
