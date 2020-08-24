import { NsfParSortOrder as urlBuilder } from "./index";

export function get(
  pageNumber = 1,
  sortOrder: urlBuilder = "Relevance"
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

export function getRange(
  startPage: number,
  endPage: number,
  sortOrder?: urlBuilder
): string[] {
  const urls: string[] = [];

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    urls.push(get(pageNumber, sortOrder));
  }
  return urls;
}
