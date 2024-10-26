import inquirer from 'inquirer'
import ora from "ora"
import boxen from 'boxen'
import chalk from "chalk"
import fs from "fs"
import axios from "axios"
import { execa } from "execa"
import fetchMusics from "./mrtehran.js"

let isPlaying = false
const spinner = ora('Loading Musics').start()

async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);
  const data = await axios.get(url)
  const length = data.headers["content-length"]
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    onDownloadProgress: (progressEvent) => {
      const total = parseInt(length, 10);
      const current = progressEvent.loaded;
      const percentage = Math.floor((current / total) * 100);
      spinner.text = chalk.magenta.bold("Downloading: ") + `${percentage}%`
    },
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

let musicName;
const main = async () => {
  const musics = await fetchMusics()
  const prompts = await inquirer.prompt([
    {
      type: "list",
      name: "selectedSong",
      message: "Select The Song:",
      choices: musics.map(item => item.track_title)
    }
  ])
  const { selectedSong } = prompts
  const { track_title, track_artist, track_audio, duration, plays, likes } = musics.find(item => item.track_title === selectedSong)
  const date = new Date(0)
  date.setSeconds(duration)
  const dt = date.toISOString().substring(14, 19)
  console.log(boxen(chalk.bold.magenta("Title: ") + chalk.bold(track_title) + "\n" + chalk.bold.yellowBright("Artist: ") + chalk.bold(track_artist) + "\n" + chalk.blueBright.bold("Plays: ") + chalk.bold(plays) + "\n" + chalk.greenBright.bold("Likes: ") + chalk.bold(likes) + "\n" + chalk.bold.yellowBright("Time: ") + chalk.bold(dt), { padding: 1, title: chalk.cyan("Information"), borderStyle: "round" }))
  spinner.text = "Waiting for download " + chalk.magenta.bold(track_title)
  spinner.color = "yellow"
  spinner.start()
  musicName = `${track_title} [${track_artist}].mp3`
  await downloadFile(track_audio, musicName)
  spinner.stop()
  console.log(chalk.bold.magenta("Finished :)"))
  isPlaying = true
  await execa`mplayer ${musicName} > /dev/null 2>&1`
}
process.on("SIGINT", async () => {
  if (isPlaying) {
    console.log("\tStopped Player And Exit...")
    isPlaying = false
    process.exit()
  } else {
    console.log(chalk.red.bold("\tDownload Canceled."))
    if (musicName) fs.rmSync(musicName)
    process.exit()
  }
})

main()
spinner.stop()
