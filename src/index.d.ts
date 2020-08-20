/// <reference types="node" />
declare module "index" {
  export interface Metadata {
    pageCount?: number;
    resultCount?: number;
  }
  export interface Parameters {
    pageNumber?: number;
    sortOrder?: SortOrder;
  }
  export interface Publication {
    title?: string;
    hyperlink?: string;
    doi?: string;
    isEmbargoed?: boolean;
    publicationDate?: Date;
    embargoReleaseDate?: Date;
  }
  export interface Response {
    publications: Publication[];
    metadata: Metadata;
  }
  export type SortOrder = "Relevance" | "DateAscending" | "DateDescending";
  export function getUrl(pageNumber?: number, sortOrder?: SortOrder): string;
  export function getUrlRange(
    startPage: number,
    endPage: number,
    sortOrder?: SortOrder
  ): string[];
  export function scrapePage(html: string | Buffer): Response;
}
