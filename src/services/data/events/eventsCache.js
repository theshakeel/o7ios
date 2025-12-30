let cachedEvents = null;
let cachedMeta = null;

export const getCachedEvents = () => {
  if (!cachedEvents) return null;

  return {
    events: cachedEvents,
    meta: cachedMeta,
  };
};

export const setCachedEvents = (events, meta) => {
  cachedEvents = events;
  cachedMeta = meta;
};

export const clearCachedEvents = () => {
  cachedEvents = null;
  cachedMeta = null;
};
