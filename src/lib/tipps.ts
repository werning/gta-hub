import { createContentStore, type ContentItem, type ContentStatus } from "./content-store";

export type TippStatus = ContentStatus;
export type Tipp = ContentItem;

const store = createContentStore<Tipp>("tipps", "tipps");

export const getAllTipps = store.getAll;
export const getPublishedTipps = store.getPublished;
export const getDraftTipps = store.getDrafts;
export const getTippBySlug = store.getBySlug;
export const getKnownTippSourceUrls = store.getKnownSourceUrls;
export const saveTipp = store.save;
export const setTippStatus = store.setStatus;
export const deleteTipp = store.remove;
