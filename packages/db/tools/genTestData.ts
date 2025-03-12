import { openAsBlob } from 'node:fs'
import { parseArgs } from 'node:util'

import { faker } from '@faker-js/faker'
import { configDotenv } from 'dotenv'

import MockDate from 'mockdate'
import { addAnnouncement, createChannel, deleteChannel, getChannel, setStorage } from '../src/'
import { createLocalStorage } from '../src/storage/LocalStorage'

configDotenv({ path: '.env.local' })

setStorage(createLocalStorage())

const channelData = {
  name: 'Aether Dynamics Corporation',
  desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
}

faker.seed(1192)

function genAnnouncement() {
  const title = faker.lorem.sentence({ min: 5, max: 10 })
  const body = faker.lorem.paragraphs({ min: 1, max: 10 })

  return {
    title,
    body,
  }
}

async function generate(userID: string, channelID: string, count: number) {
  {
    const channel = await getChannel({ userID, channelID })
    if (channel) {
      await deleteChannel({ userID, channelID, updatedAt: channel.updatedAt })
    }
  }

  let date = new Date('2024-08-08T11:59:00Z').getTime()
  {
    MockDate.set(date)
    const icon = await openAsBlob('./tools/assets/cat-1484725_256.png', { type: 'image/png' })
    await createChannel({
      userID,
      channelID,
      name: channelData.name,
      desc: channelData.desc,
      icon,
    })
  }

  {
    const getHeaderImage = async (i: number) => {
      switch (i % 13) {
        case 0:
          return await openAsBlob('./tools/assets/gecko-8483282_640.png', { type: 'image/png' })
        case 1:
          return await openAsBlob('./tools/assets/cat-8575641_640.jpg', { type: 'image/jpeg' })
      }
    }

    const getImages = async (i: number) => {
      switch (i % 8) {
        case 2:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg', { type: 'image/jpeg' }),
          ])
        case 3:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg', { type: 'image/jpeg' }),
            openAsBlob('./tools/assets/leaves-8846763_640.jpg', { type: 'image/jpeg' }),
          ])
        case 4:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg', { type: 'image/jpeg' }),
            openAsBlob('./tools/assets/leaves-8846763_640.jpg', { type: 'image/jpeg' }),
            openAsBlob('./tools/assets/cat-8612685_640_small.jpg', { type: 'image/jpeg' }),
          ])
        case 5:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg', { type: 'image/jpeg' }),
            openAsBlob('./tools/assets/leaves-8846763_640.jpg', { type: 'image/jpeg' }),
            openAsBlob('./tools/assets/cat-8612685_640_small.jpg', { type: 'image/jpeg' }),
            openAsBlob('./tools/assets/music-8559592_640.jpg', { type: 'image/jpeg' }),
          ])
      }
    }

    for (let i = 0; i < count; i++) {
      const channel = await getChannel({ userID, channelID })
      if (!channel) {
        throw new Error()
      }
      const a = genAnnouncement()

      date += 60 * 60 * 24 * 1000
      MockDate.set(date)

      await addAnnouncement({
        userID,
        channelID,
        headerImage: await getHeaderImage(i),
        title: a.title,
        body: a.body,
        images: await getImages(i),
        createdAt: new Date().getTime(),
      })
    }
  }
}

async function main() {
  const printUsage = () => {
    console.log('pnpm run genTestData')
  }

  const parsed = parseArgs({
    options: {
      userID: {
        type: 'string',
        default: 'credentials:test_user01',
      },
      channelID: {
        type: 'string',
        default: '9901',
      },
      count: {
        type: 'string',
        short: 'c',
        default: '100',
      },
    },
  })

  const { userID, channelID } = parsed.values
  const count = Number.parseInt(parsed.values.count)

  if (!userID || !channelID) {
    printUsage()
    return
  }

  await generate(userID, channelID, count)
}

await main()
