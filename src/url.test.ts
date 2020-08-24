import * as url from "./url";

test("Empty query should return URL with no search parameters", () => {
  expect(url.get()).toEqual("https://par.nsf.gov/search");
});

test("Query with pageNumber >= 2 should return URL with no search parameters", () => {
  expect(url.get(2)).toEqual("https://par.nsf.gov/search/page:2");
});

test("Query with pageNumber < 2 should return URL with no search parameters", () => {
  expect(url.get(1)).toEqual("https://par.nsf.gov/search");
  expect(url.get(0)).toEqual("https://par.nsf.gov/search");
  expect(url.get(-1)).toEqual("https://par.nsf.gov/search");
});

test('Query with sortOrder set to "Relevance" should return URL with no search parameters', () => {
  expect(url.get(undefined, "Relevance")).toEqual("https://par.nsf.gov/search");
});

test("Query with other sortOrder values should return URL with given sortOrder", () => {
  expect(url.get(undefined, "DateAscending")).toEqual(
    "https://par.nsf.gov/search/sort:publication_date%20asc"
  );
  expect(url.get(undefined, "DateDescending")).toEqual(
    "https://par.nsf.gov/search/sort:publication_date%20desc"
  );
});
