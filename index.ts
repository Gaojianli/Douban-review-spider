'use strict'

import { fetchHotMovie } from './fetchHotMovie'
import { fetchReview } from './fetchReviews'
import fs from 'fs'
async function main () {
  const hotList = await fetchHotMovie()
  await Promise.all(hotList.map(async movie => {
    const reviews = await fetchReview(movie.id)
    if (!fs.existsSync('./output')) { await fs.promises.mkdir('./output') }
    if (!fs.existsSync(`${movie.name}`)) { await fs.promises.mkdir(`./output/${movie.name}`) }
    await Promise.all(reviews.map(review => fs.promises.writeFile(`./output/${movie.name}/${review.title}.html`, review.body)))
      .then(() => console.log(`Movie ${movie.name} writed.`))
  }))
}
main()
