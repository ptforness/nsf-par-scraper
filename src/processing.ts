/**
 * @ignore
 * @param doi
 */
export function processDoi(doi: string): string | undefined {
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
export function processReleaseDate(releaseDateText: string): Date | undefined {
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
