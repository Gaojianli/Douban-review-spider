import { JSDOM } from 'jsdom'
import config from './config.json'
import fetch from 'node-fetch'
class Review {
  constructor (id: string, title: string, body: string) {
    this.title = title
    this.body = body
    this.videoID = id
  }

    title: string;
    body: string;
    videoID: string;
}
export const fetchReview = async (id: string): Promise<Review[]> => {
  const max_limit = config.review_limit
  const review_list_url = `https://movie.douban.com/subject/${id}/reviews?start=`
  const result: Review[] = []
  for (let index = 0; index < max_limit; index += 20) {
    const raw_html = await fetch(review_list_url + `${index}`, {
      headers: config.headers,
      method: 'GET'
    }).then(res => res.text())
    const { document } = (new JSDOM(raw_html)).window
    global.document = document
    const window = document.defaultView
    const $ = require('jquery')(window)
    const review_raw = $('.main-bd').find('h2').find('a')
    if (review_raw.length < 20) {
      // 剩余影评数量不足20了,直接结束
      index = max_limit
    }
    const current_page: Review[] = await Promise.all(review_raw.map(async (_: number, item: HTMLAnchorElement) => {
      const link = item.href
      const title = item.innerHTML.replace(/\//g, '')
      const review_id = link.replace(/[^0-9]/g, '')
      try {
        if (review_id && title) {
          const res = await fetch(`https://movie.douban.com/j/review/${review_id}/full`, {
            headers: config.headers,
            method: 'GET'
          }).then(res => res.json())
          return new Review(id, title, res.html)
        }
      } catch (e) {
        console.log(`fetch url:https://movie.douban.com/j/review/${review_id}/full`)
        console.error(e)
      }
    }))
    result.push(...current_page)
  }
  return result
}
