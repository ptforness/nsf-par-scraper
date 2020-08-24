import { request } from "./request";
import { scrapeResponse } from "./scrape";
import * as urlBuilder from "./url";

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
export type NsfParSortOrder = "Relevance" | "DateAscending" | "DateDescending";

export async function getPage(
  pageNumber = 1,
  sortOrder: NsfParSortOrder = "Relevance"
): Promise<NsfParResponse> {
  const url = urlBuilder.get(pageNumber, sortOrder);
  const data = await request(url);
  return scrapeResponse(data);
}
