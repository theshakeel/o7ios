import { getSinglePage } from "./data/pages";

export const EXTERNAL_SLUGS = [
  "page-1",
  "howto",
  "page-4",
  "page-4-1",
  "page-3",
  "terms",
];

/**
 * Preload all pages with delay (ms)
 */
export const preloadPages = async (delay = 1000) => {
  for (let i = 0; i < EXTERNAL_SLUGS.length; i++) {
    const slug = EXTERNAL_SLUGS[i];

    try {
      console.log("[Preload] Loading page:", slug);
      await getSinglePage(slug);
    } catch (err) {
      console.warn("[Preload] Failed for slug:", slug, err);
    }

    // ⏳ wait before next request
    if (i < EXTERNAL_SLUGS.length - 1) {
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.log("[Preload] All pages cached");
};
