import { createContentStore, type ContentItem, type ContentStatus } from "./content-store";

export type HackStatus = ContentStatus;
export type Hack = ContentItem;

const store = createContentStore<Hack>("hacks-und-tricks", "hacks");

export const getAllHacks = store.getAll;
export const getPublishedHacks = store.getPublished;
export const getDraftHacks = store.getDrafts;
export const getDraftHacksLive = store.getDraftsLive;
export const getHackBySlug = store.getBySlug;
export const getKnownHackSourceUrls = store.getKnownSourceUrls;
export const saveHack = store.save;
export const setHackStatus = store.setStatus;
export const deleteHack = store.remove;
