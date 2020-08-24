/// <reference types="node" />
declare module "url" {
  import { NsfParSortOrder as urlBuilder } from "index";
  export function get(pageNumber?: number, sortOrder?: urlBuilder): string;
  export function getRange(
    startPage: number,
    endPage: number,
    sortOrder?: urlBuilder
  ): string[];
}
declare module "request" {
  export function request(url: string): Promise<string>;
}
declare module "processing" {
  export function processDoi(doi: string): string | undefined;
  export function processReleaseDate(releaseDateText: string): Date | undefined;
}
declare module "scrape" {
  import { NsfParMetadata, NsfParPublication, NsfParResponse } from "index";
  export function scrapeResponse(html: string | Buffer): NsfParResponse;
  export function getMetadata(response: CheerioStatic): NsfParMetadata;
  export function getPublications(response: CheerioStatic): NsfParPublication[];
}
declare module "index" {
  export interface NsfParMetadata {
    pageCount?: number;
    resultCount?: number;
  }
  export interface NsfParParameters {
    pageNumber?: number;
    sortOrder?: NsfParSortOrder;
  }
  export interface NsfParPublication {
    title?: string;
    hyperlink?: string;
    doi?: string;
    isEmbargoed?: boolean;
    publicationDate?: Date;
    embargoReleaseDate?: Date;
  }
  export interface NsfParResponse {
    publications: NsfParPublication[];
    metadata: NsfParMetadata;
  }
  export type NsfParSortOrder =
    | "Relevance"
    | "DateAscending"
    | "DateDescending";
  export function getPage(
    pageNumber?: number,
    sortOrder?: NsfParSortOrder
  ): Promise<NsfParResponse>;
}
