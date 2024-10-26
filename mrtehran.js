/*import { load } from "cheerio"

const url = "https://mrtehran.app/browse/featured?_rsc=xsk8p"

const main = async () => {
  const response = await fetch(url, {
    method: "GET"
  })
  const data = await response.text()
  const $ = load(data)
  const script = $("body > script:nth-child(6)")
  console.log(script.text())
}

main()*/
const host = "https://cdnmrtehran.ir/media/"
const fetchMusics = async () => {
  const res = await fetch("https://mrtehran.app/browse/featured?_rsc=xsk8p", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "next-router-state-tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22browse%22%2C%7B%22children%22%3A%5B%22featured%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Fbrowse%2Ffeatured%22%2C%22refresh%22%5D%7D%2Cnull%2C%22refetch%22%5D%7D%5D%7D%5D",
      "rsc": "1",
      "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "Referer": "https://mrtehran.app/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });
  const data = await res.text()
  let musics = data.split("\n")[4]
  musics = musics.substr(18)
  musics = musics.slice(0, -1)
  const output = JSON.parse(musics)
  //console.log(output.data.tracks)
  const tracks = output.data.tracks.map(item => {
    item.track_artwork = host + item.track_artwork
    item.track_audio = host + item.track_audio
    return item
  })
  return tracks
}

export default fetchMusics
