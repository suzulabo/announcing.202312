import { openAsBlob } from 'node:fs';
import { parseArgs } from 'node:util';

import { faker } from '@faker-js/faker';
import MockDate from 'mockdate';

import { addAnnouncement } from '../src/api/announcement/addAnnouncement';
import { createChannel } from '../src/api/channel/createChannel';
import { deleteChannel } from '../src/api/channel/deleteChannel';
import { getChannel } from '../src/api/channel/getChannel';

const channelData = {
  name: 'Aether Dynamics Corporation',
  desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
};

faker.seed(1192);

MockDate.set('2024-08-08T11:59:00Z');

const genAnnouncement = () => {
  const title = faker.lorem.sentence();
  const body = faker.lorem.text();

  return {
    title,
    body,
  };
};

const generate = async (userID: string, channelID: string, count: number) => {
  {
    const channel = await getChannel({ userID, channelID });
    if (channel) {
      await deleteChannel({ userID, channelID, updatedAt: channel.updatedAt });
    }
  }

  {
    const iconFile = await openAsBlob('./tools/assets/cat-1484725_256.png');
    await createChannel({
      userID,
      channelID,
      name: channelData.name,
      desc: channelData.desc,
      iconFile,
    });
  }

  {
    const getHeaderImage = async (i: number) => {
      switch (i % 13) {
        case 0:
          return await openAsBlob('./tools/assets/gecko-8483282_640.png');
        case 1:
          return await openAsBlob('./tools/assets/cat-8575641_640.jpg');
      }
      return;
    };

    const getImages = async (i: number) => {
      switch (i % 8) {
        case 2:
          return Promise.all([openAsBlob('./tools/assets/chicks-8782391_640.jpg')]);
        case 3:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg'),
            openAsBlob('./tools/assets/leaves-8846763_640.jpg'),
          ]);
        case 4:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg'),
            openAsBlob('./tools/assets/leaves-8846763_640.jpg'),
            openAsBlob('./tools/assets/cat-8612685_640_small.jpg'),
          ]);
        case 5:
          return Promise.all([
            openAsBlob('./tools/assets/chicks-8782391_640.jpg'),
            openAsBlob('./tools/assets/leaves-8846763_640.jpg'),
            openAsBlob('./tools/assets/cat-8612685_640_small.jpg'),
            openAsBlob('./tools/assets/music-8559592_640.jpg'),
          ]);
      }
      return;
    };

    for (let i = 0; i < count; i++) {
      const channel = await getChannel({ userID, channelID });
      if (!channel) {
        throw new Error();
      }
      const a = genAnnouncement();
      await addAnnouncement({
        userID,
        channelID,
        headerImageFile: await getHeaderImage(i),
        title: a.title,
        body: a.body,
        imagesFiles: await getImages(i),
        createdAt: new Date().getTime(),
      });
    }
  }
};

const main = async () => {
  const printUsage = () => {
    console.log('pnpm run genTestData');
  };

  const parsed = parseArgs({
    options: {
      userID: {
        type: 'string',
        default: 'test',
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
  });

  const { userID, channelID } = parsed.values;
  const count = parseInt(parsed.values.count ?? '');

  if (!userID || !channelID) {
    printUsage();
    return;
  }

  await generate(userID, channelID, count);
};

await main();
