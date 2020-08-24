import * as cheerio from "cheerio";
import { NsfParMetadata, NsfParPublication, NsfParResponse } from "./index";
import { processDoi, processReleaseDate } from "./processing";

/**
 * Scrapes publication data from an empty query against the NSF PAR.
 * @remarks Only empty queries are supported, as result accuracy with any non-sort parameter has been low in my experience.
 * @param data The raw response data to be scraped
 * @returns The processed publication data and search metadata for the given page number
 */
export function scrapeResponse(html: string | Buffer): NsfParResponse {
  const data: CheerioStatic = cheerio.load(html);
  return {
    metadata: getMetadata(data),
    publications: getPublications(data),
  };
}

/**
 * @ignore
 * @param response
 */
export function getMetadata(response: CheerioStatic): NsfParMetadata {
  const pageCount = Number(response(".paging-max").first().text());
  const resultCount = Number(response("#item-count-everything").text());
  return {
    pageCount,
    resultCount,
  };
}

/**
 * @ignore
 * @param response
 */
export function getPublications(response: CheerioStatic): NsfParPublication[] {
  const publications: NsfParPublication[] = [];
  const publicationData: Cheerio = response(".article , .item , .document");
  publicationData.each(function () {
    const publicationDate: Date = new Date(
      response(this).find("time[itemprop=datePublished]").attr("datetime")
    );

    const isEmbargoed: boolean = response(this)
      .find("span.reader-count")
      .text()
      .includes("Free, publicly-accessible full text available");

    const embargoReleaseDate: Date = processReleaseDate(
      response(this).find("span.reader-count").text()
    );

    publications.push({
      title: response(this).find("span[itemprop=name]").text(),
      hyperlink: response(this).find("a[itemprop=url]").attr("href"),
      doi: processDoi(response(this).find("a.misc , .doi-link").attr("href")),
      isEmbargoed,
      publicationDate,
      embargoReleaseDate,
    });
  });
  return publications;
}
