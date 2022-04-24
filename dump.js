
const test = async () => {
  // console.log('app.js::[8] var', var)
  // const files = getFilesOfDir('course-videos')
  // console.log('app.js::[14] files', files)
}

async function wait(data = [], milliSecond = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliSecond, data);
  });
}

  // const courseVideos = await readJsonSync('course-videos/test.json')
  // const data = await courseVideos.chapters.map(course => wait(course))
  // await Promise.all(data).then(res => res)
  // return data
