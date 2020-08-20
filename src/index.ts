import * as cheerio from "cheerio";

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

export function getUrl(
  pageNumber = 1,
  sortOrder: SortOrder = "Relevance"
): string {
  let url = "https://par.nsf.gov/search";
  if (pageNumber > 1) {
    url += `/page:${pageNumber}`;
  }

  switch (sortOrder) {
    case "DateAscending":
      url += "/sort:publication_date%20asc";
      break;
    case "DateDescending":
      url += "/sort:publication_date%20desc";
      break;
  }
  return url;
}

export function getUrlRange(
  startPage: number,
  endPage: number,
  sortOrder?: SortOrder
): string[] {
  const urls: string[] = [];

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    urls.push(getUrl(pageNumber, sortOrder));
  }
  return urls;
}

/**
 * Scrapes publication data from an empty query against the NSF PAR.
 * @remarks Only empty queries are supported, as result accuracy with any non-sort parameter has been low in my experience.
 * @param data The raw response data to be scraped
 * @returns The processed publication data and search metadata for the given page number
 */
export function scrapePage(html: string | Buffer): Response {
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
function getMetadata(response: CheerioStatic): Metadata {
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
function getPublications(response: CheerioStatic): Publication[] {
  const publications: Publication[] = [];
  const publicationData: Cheerio = response(".article , .item , .document");
  publicationData.each(function () {
    const publicationDate: Date = new Date(
      response(this).find("time[itemprop=datePublished]").attr("datetime")
    );

    const isEmbargoed: boolean = response(this)
      .find("span.reader-count")
      .text()
      .includes("Free, publicly-accessible full text available");

    const embargoReleaseDate: Date = parseReleaseDate(
      response(this).find("span.reader-count").text()
    );

    publications.push({
      title: response(this).find("span[itemprop=name]").text(),
      hyperlink: response(this).find("a[itemprop=url]").attr("href"),
      doi: cleanDOI(response(this).find("a.misc , .doi-link").attr("href")),
      isEmbargoed,
      publicationDate,
      embargoReleaseDate,
    });
  });
  return publications;
}

/**
 * @ignore
 * @param doi
 */
function cleanDOI(doi: string): string | undefined {
  if (doi == null) return undefined;

  const forbiddenSubstrings: (string | RegExp)[] = [
    /https?:\/\/dx.doi.org\//,
    /https?:\/\/doi.org\//,
    /doi:\w?/,
    /I:\w?/,
    /https:\/\/pubs.acs.org\/doi\//,
  ];

  for (const i of forbiddenSubstrings) {
    doi = doi.replace(i, "");
  }

  return doi;
}

/**
 * @ignore
 * @param releaseDateText
 */
function parseReleaseDate(releaseDateText: string): Date | undefined {
  const monthRegExp = /(?:[Jj]an(?:uary)?|[Ff]eb(?:ruary)?|[Mm]ar(?:ch)?|[Aa]pr(?:il)?|[Mm]ay|[Jj]un(?:e)?|[Jj]ul(?:y)?|[Aa]ug(?:ust)?|[Ss]ep(?:tember)?|[Oo]ct(?:ober)?|[Nn]ov(?:ember)?|[Dd]ec(?:ember)?)/;
  const dayRegExp = /(?:(?:[1-2][0-9])|(?:3[0-1])|(?:0?[1-9]))/;
  const yearRegExp = /(?:\d{4}|\d{2})/;
  const finalRegExp = new RegExp(
    monthRegExp.source +
      /\s/.source +
      dayRegExp.source +
      /,\s/.source +
      yearRegExp.source
  );
  const matches: RegExpMatchArray = releaseDateText.match(finalRegExp);
  return matches == null || matches.length === 0
    ? undefined
    : new Date(matches[0]);
}
