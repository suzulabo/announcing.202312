import * as v from 'valibot';

const STORAGE_KEY = 'favorites';

const favoritesSchema = v.record(
  v.pipe(v.string(), v.nonEmpty()),
  v.strictObject({
    name: v.pipe(v.string(), v.nonEmpty()),
    icon: v.optional(v.pipe(v.string(), v.nonEmpty())),
    notification: v.optional(v.boolean()),
  }),
);

type Favorites = v.InferInput<typeof favoritesSchema>;
type Favorite = Favorites[string];

export const getFavorites = (): Favorites => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

    if (v.is(favoritesSchema, data)) {
      return data;
    } else {
      return {};
    }
  } catch {
    return {};
  }
};

export const addFavorite = (value: Favorite & { channelID: string }) => {
  const data = getFavorites();
  const current = data[value.channelID];
  data[value.channelID] = {
    name: value.name,
    ...(value.icon && { icon: value.icon }),
    ...(current?.notification && { notification: current.notification }),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const deleteFavorite = (channelID: string) => {
  const data = getFavorites();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [channelID]: _, deleted } = data;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(deleted));
};

export const updateFavorites = (channels: (Favorite & { channelID: string })[]) => {
  const favorites: Favorites = {};
  for (const channel of channels) {
    const favorite: Favorite = {
      name: channel.name,
    };
    if (channel.icon) {
      favorite.icon = channel.icon;
    }
    if (channel.notification) {
      favorite.notification = true;
    }
    favorites[channel.channelID] = favorite;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};
