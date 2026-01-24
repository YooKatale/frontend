export const FormatCurr = (curr) =>
  new Intl.NumberFormat().format(Number(curr) || 0);
