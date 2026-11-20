import { createContentStore, type ContentItem, type ContentStatus } from "./content-store";

export type ArticleStatus = ContentStatus;
export type Article = ContentItem;

const store = createContentStore<Article>("news", "news");

export const getAllArticles = store.getAll;
export const getPublishedArticles = store.getPublished;
export const getDraftArticles = store.getDrafts;
export const getArticleBySlug = store.getBySlug;
export const getKnownSourceUrls = store.getKnownSourceUrls;
export const saveArticle = store.save;
export const setArticleStatus = store.setStatus;
export const deleteArticle = store.remove;
