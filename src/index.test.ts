import * as NsfPar from "./index";

test("Empty query should return URL with no search parameters", () => {
  expect(NsfPar.getUrl()).toEqual("https://par.nsf.gov/search");
});

test("Query with pageNumber >= 2 should return URL with no search parameters", () => {
  expect(NsfPar.getUrl(2)).toEqual("https://par.nsf.gov/search/page:2");
});

test("Query with pageNumber < 2 should return URL with no search parameters", () => {
  expect(NsfPar.getUrl(1)).toEqual("https://par.nsf.gov/search");
  expect(NsfPar.getUrl(0)).toEqual("https://par.nsf.gov/search");
  expect(NsfPar.getUrl(-1)).toEqual("https://par.nsf.gov/search");
});

test('Query with sortOrder set to "Relevance" should return URL with no search parameters', () => {
  expect(NsfPar.getUrl(undefined, "Relevance")).toEqual(
    "https://par.nsf.gov/search"
  );
});

test("Query with other sortOrder values should return URL with given sortOrder", () => {
  expect(NsfPar.getUrl(undefined, "DateAscending")).toEqual(
    "https://par.nsf.gov/search/sort:publication_date%20asc"
  );
  expect(NsfPar.getUrl(undefined, "DateDescending")).toEqual(
    "https://par.nsf.gov/search/sort:publication_date%20desc"
  );
});
