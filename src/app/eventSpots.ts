export function normalizeSpotsRange(spotsMin: number, spotsMax: number) {
  const min = Number.isFinite(spotsMin) ? Math.max(0, Math.trunc(spotsMin)) : 0;
  const max = Number.isFinite(spotsMax) ? Math.max(0, Math.trunc(spotsMax)) : 0;

  return {
    spotsMin: min,
    spotsMax: max,
  };
}

export function formatSpotsRange(spotsMin: number, spotsMax: number) {
  const { spotsMin: min, spotsMax: max } = normalizeSpotsRange(spotsMin, spotsMax);

  if (min === max) {
    return `${min} lugar${min === 1 ? "" : "es"}`;
  }

  return `${min} a ${max} lugares`;
}
