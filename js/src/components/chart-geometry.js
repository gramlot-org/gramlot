/** Shared predicates for store geometries and imported GeoJSON. */
export function isChartCoordinate(point) {
    return Array.isArray(point) && point.length >= 2 && point.length <= 3
        && point.every(Number.isFinite);
}

export function isChartPolygon(rings) {
    return Array.isArray(rings) && rings.length > 0 && rings.every(ring =>
        Array.isArray(ring) && ring.length >= 4 && ring.every(isChartCoordinate)
        && JSON.stringify(ring[0]) === JSON.stringify(ring.at(-1)));
}
