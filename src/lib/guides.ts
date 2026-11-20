import { createContentStore, type ContentItem, type ContentStatus } from "./content-store";

export type GuideStatus = ContentStatus;
export type Guide = ContentItem;

const store = createContentStore<Guide>("missionsanleitungen", "guides");

export const getAllGuides = store.getAll;
export const getPublishedGuides = store.getPublished;
export const getDraftGuides = store.getDrafts;
export const getGuideBySlug = store.getBySlug;
export const getKnownGuideSourceUrls = store.getKnownSourceUrls;
export const saveGuide = store.save;
export const setGuideStatus = store.setStatus;
export const deleteGuide = store.remove;
