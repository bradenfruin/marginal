/**
 * Marginal Catan placement engine.
 *
 * This module deliberately has no DOM or network dependencies. Boards, scoring,
 * grading, validation, and SVG rendering are deterministic pure data/functions.
 */

export const CATAN_RESOURCE_DISTRIBUTION = Object.freeze({
  sheep: 4,
  wood: 4,
  wheat: 4,
  brick: 3,
  ore: 3,
  desert: 1,
});

export const CATAN_NUMBER_TOKENS = Object.freeze([
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
]);

export const CATAN_PIPS = Object.freeze({
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  8: 5,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
});

const BOARD_RADIUS = 2;
const SQRT_3 = Math.sqrt(3);
const AXIAL_DIRECTIONS = Object.freeze([
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]);

const PORT_TYPES = Object.freeze([
  "generic",
  "sheep",
  "generic",
  "wood",
  "wheat",
  "generic",
  "brick",
  "ore",
  "generic",
]);

// Nine occupied coast edges, spread around the 30-edge coastline.
const PORT_COAST_EDGE_INDICES = Object.freeze([0, 3, 7, 10, 13, 17, 20, 23, 27]);

const RESOURCE_COLORS = Object.freeze({
  sheep: "#9dcc6b",
  wood: "#43845a",
  wheat: "#e7bd55",
  brick: "#bd654c",
  ore: "#8792a0",
  desert: "#d8b982",
});

const RESOURCE_LABELS = Object.freeze({
  sheep: "Sheep",
  wood: "Wood",
  wheat: "Wheat",
  brick: "Brick",
  ore: "Ore",
  desert: "Desert",
});

function roundCoordinate(value) {
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function pointKey(x, y) {
  return `${roundCoordinate(x)},${roundCoordinate(y)}`;
}

function comparePoints(a, b) {
  return a.y - b.y || a.x - b.x;
}

function axialToPoint(q, r) {
  return {
    x: SQRT_3 * (q + r / 2),
    y: 1.5 * r,
  };
}

function hexCorners(q, r) {
  const center = axialToPoint(q, r);
  return Array.from({ length: 6 }, (_, cornerIndex) => {
    const angle = ((30 + cornerIndex * 60) * Math.PI) / 180;
    return {
      x: roundCoordinate(center.x + Math.cos(angle)),
      y: roundCoordinate(center.y + Math.sin(angle)),
    };
  });
}

function makeHexCoordinates() {
  const coordinates = [];
  for (let r = -BOARD_RADIUS; r <= BOARD_RADIUS; r += 1) {
    const qMin = Math.max(-BOARD_RADIUS, -r - BOARD_RADIUS);
    const qMax = Math.min(BOARD_RADIUS, -r + BOARD_RADIUS);
    for (let q = qMin; q <= qMax; q += 1) {
      coordinates.push({ q, r });
    }
  }

  return coordinates.map((coordinate, index) =>
    Object.freeze({
      id: `h${String(index + 1).padStart(2, "0")}`,
      ...coordinate,
    }),
  );
}

export const CATAN_HEX_COORDINATES = Object.freeze(makeHexCoordinates());

function buildTopology() {
  const temporaryVertices = new Map();
  const temporaryEdges = new Map();

  for (const hex of CATAN_HEX_COORDINATES) {
    const corners = hexCorners(hex.q, hex.r);

    for (const corner of corners) {
      const key = pointKey(corner.x, corner.y);
      const existing = temporaryVertices.get(key) ?? {
        key,
        x: corner.x,
        y: corner.y,
        adjacentHexIds: [],
      };
      existing.adjacentHexIds.push(hex.id);
      temporaryVertices.set(key, existing);
    }

    for (let cornerIndex = 0; cornerIndex < 6; cornerIndex += 1) {
      const start = corners[cornerIndex];
      const end = corners[(cornerIndex + 1) % 6];
      const startKey = pointKey(start.x, start.y);
      const endKey = pointKey(end.x, end.y);
      const key = [startKey, endKey].sort().join("|");
      const existing = temporaryEdges.get(key) ?? {
        key,
        vertexKeys: [startKey, endKey],
        adjacentHexIds: [],
      };
      existing.adjacentHexIds.push(hex.id);
      temporaryEdges.set(key, existing);
    }
  }

  const sortedTemporaryVertices = [...temporaryVertices.values()].sort(comparePoints);
  const idByPointKey = new Map();
  sortedTemporaryVertices.forEach((vertex, index) => {
    idByPointKey.set(vertex.key, `v${String(index + 1).padStart(2, "0")}`);
  });

  const edges = [...temporaryEdges.values()]
    .map((edge) => {
      const vertexIds = edge.vertexKeys.map((key) => idByPointKey.get(key)).sort();
      return {
        vertexIds,
        adjacentHexIds: [...edge.adjacentHexIds].sort(),
      };
    })
    .sort((a, b) => a.vertexIds.join("-").localeCompare(b.vertexIds.join("-")))
    .map((edge, index) =>
      Object.freeze({
        id: `e${String(index + 1).padStart(2, "0")}`,
        vertexIds: Object.freeze(edge.vertexIds),
        adjacentHexIds: Object.freeze(edge.adjacentHexIds),
      }),
    );

  const vertexPointById = new Map(
    sortedTemporaryVertices.map((vertex) => [idByPointKey.get(vertex.key), vertex]),
  );
  const coastlineEdges = edges
    .filter((edge) => edge.adjacentHexIds.length === 1)
    .map((edge) => {
      const first = vertexPointById.get(edge.vertexIds[0]);
      const second = vertexPointById.get(edge.vertexIds[1]);
      const midpoint = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
      };
      return {
        ...edge,
        angle: Math.atan2(midpoint.y, midpoint.x),
      };
    })
    .sort((a, b) => a.angle - b.angle);

  const ports = PORT_COAST_EDGE_INDICES.map((coastIndex, index) => {
    const edge = coastlineEdges[coastIndex];
    const type = PORT_TYPES[index];
    return Object.freeze({
      id: `p${String(index + 1).padStart(2, "0")}`,
      type,
      ratio: type === "generic" ? 3 : 2,
      edgeId: edge.id,
      vertexIds: Object.freeze([...edge.vertexIds]),
    });
  });

  const portIdsByVertex = new Map();
  for (const port of ports) {
    for (const vertexId of port.vertexIds) {
      const portIds = portIdsByVertex.get(vertexId) ?? [];
      portIds.push(port.id);
      portIdsByVertex.set(vertexId, portIds);
    }
  }

  const neighborIdsByVertex = new Map();
  for (const edge of edges) {
    const [first, second] = edge.vertexIds;
    const firstNeighbors = neighborIdsByVertex.get(first) ?? [];
    const secondNeighbors = neighborIdsByVertex.get(second) ?? [];
    firstNeighbors.push(second);
    secondNeighbors.push(first);
    neighborIdsByVertex.set(first, firstNeighbors);
    neighborIdsByVertex.set(second, secondNeighbors);
  }

  const vertices = sortedTemporaryVertices.map((vertex) => {
    const id = idByPointKey.get(vertex.key);
    return Object.freeze({
      id,
      x: vertex.x,
      y: vertex.y,
      adjacentHexIds: Object.freeze([...vertex.adjacentHexIds].sort()),
      neighborVertexIds: Object.freeze([...(neighborIdsByVertex.get(id) ?? [])].sort()),
      portIds: Object.freeze([...(portIdsByVertex.get(id) ?? [])]),
    });
  });

  return Object.freeze({
    vertices: Object.freeze(vertices),
    edges: Object.freeze(edges),
    ports: Object.freeze(ports),
  });
}

export const CATAN_TOPOLOGY = buildTopology();
export const CATAN_VERTICES = CATAN_TOPOLOGY.vertices;
export const CATAN_EDGES = CATAN_TOPOLOGY.edges;
export const CATAN_PORTS = CATAN_TOPOLOGY.ports;

const HEX_BY_COORDINATE = new Map(
  CATAN_HEX_COORDINATES.map((hex) => [`${hex.q},${hex.r}`, hex]),
);

const ADJACENT_HEX_IDS = new Map(
  CATAN_HEX_COORDINATES.map((hex) => [
    hex.id,
    AXIAL_DIRECTIONS.map(([dq, dr]) => HEX_BY_COORDINATE.get(`${hex.q + dq},${hex.r + dr}`)?.id)
      .filter(Boolean)
      .sort(),
  ]),
);

function hashSeed(seed) {
  const input = String(seed);
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(values, random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function expandDistribution(distribution) {
  return Object.entries(distribution).flatMap(([resource, count]) =>
    Array.from({ length: count }, () => resource),
  );
}

function hasAdjacentRedTokens(hexes) {
  const numberByHexId = new Map(hexes.map((hex) => [hex.id, hex.number]));
  return hexes.some(
    (hex) =>
      (hex.number === 6 || hex.number === 8) &&
      ADJACENT_HEX_IDS.get(hex.id).some((neighborId) => {
        const neighborNumber = numberByHexId.get(neighborId);
        return neighborNumber === 6 || neighborNumber === 8;
      }),
  );
}

function freezeBoard(board) {
  return Object.freeze({
    ...board,
    hexes: Object.freeze(board.hexes.map((hex) => Object.freeze({ ...hex }))),
    // Topology is fixed across every layout, so each board can reuse it safely.
    vertices: CATAN_VERTICES,
    edges: CATAN_EDGES,
    ports: CATAN_PORTS,
  });
}

/**
 * Create one repeatable legal layout. A given seed always produces the same board.
 */
export function generateCatanBoard(seed, id = `board-${hashSeed(seed).toString(16).padStart(8, "0")}`) {
  const random = mulberry32(hashSeed(seed));
  const resources = shuffle(expandDistribution(CATAN_RESOURCE_DISTRIBUTION), random);
  const baseHexes = CATAN_HEX_COORDINATES.map((coordinate, index) => ({
    id: coordinate.id,
    q: coordinate.q,
    r: coordinate.r,
    resource: resources[index],
    number: null,
  }));
  const producingHexes = baseHexes.filter((hex) => hex.resource !== "desert");

  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const tokens = shuffle(CATAN_NUMBER_TOKENS, random);
    const tokenByHexId = new Map(
      producingHexes.map((hex, index) => [hex.id, tokens[index]]),
    );
    const hexes = baseHexes.map((hex) => ({
      ...hex,
      number: tokenByHexId.get(hex.id) ?? null,
    }));

    if (!hasAdjacentRedTokens(hexes)) {
      return freezeBoard({ id, seed: String(seed), hexes });
    }
  }

  throw new Error(`Unable to generate a legal Catan layout for seed ${String(seed)}.`);
}

const BOARD_SEEDS = Object.freeze([
  "marginal-catan-01",
  "marginal-catan-02",
  "marginal-catan-03",
  "marginal-catan-04",
  "marginal-catan-05",
  "marginal-catan-06",
  "marginal-catan-07",
  "marginal-catan-08",
  "marginal-catan-09",
  "marginal-catan-10",
  "marginal-catan-11",
  "marginal-catan-12",
  "marginal-catan-13",
  "marginal-catan-14",
  "marginal-catan-15",
  "marginal-catan-16",
  "marginal-catan-17",
  "marginal-catan-18",
]);

export const CATAN_BOARDS = Object.freeze(
  BOARD_SEEDS.map((seed, index) =>
    generateCatanBoard(seed, `catan-${String(index + 1).padStart(2, "0")}`),
  ),
);

export function getCatanBoard(boardId) {
  return CATAN_BOARDS.find((board) => board.id === boardId) ?? null;
}

/** Pick a repeatable board for a date or arbitrary daily key. */
export function getCatanBoardForDay(dayKey = new Date().toISOString().slice(0, 10)) {
  return CATAN_BOARDS[hashSeed(dayKey) % CATAN_BOARDS.length];
}

function countValues(values) {
  return values.reduce((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function sameCounts(actual, expected) {
  const keys = new Set([...Object.keys(actual), ...Object.keys(expected)]);
  return [...keys].every((key) => actual[key] === expected[key]);
}

/**
 * Validate distributions, coordinates, topology references, and the 6/8 rule.
 * Returns diagnostics instead of throwing so it is useful in tests/dev tooling.
 */
export function validateCatanBoard(board) {
  const errors = [];
  const expectedCoordinateById = new Map(
    CATAN_HEX_COORDINATES.map((hex) => [hex.id, `${hex.q},${hex.r}`]),
  );

  if (!board || !Array.isArray(board.hexes)) {
    return { valid: false, errors: ["Board must contain a hexes array."] };
  }

  if (board.hexes.length !== 19) {
    errors.push(`Expected 19 hexes; received ${board.hexes.length}.`);
  }

  const seenHexIds = new Set();
  for (const hex of board.hexes) {
    if (seenHexIds.has(hex.id)) errors.push(`Duplicate hex id: ${hex.id}.`);
    seenHexIds.add(hex.id);
    const expectedCoordinate = expectedCoordinateById.get(hex.id);
    if (!expectedCoordinate) {
      errors.push(`Unknown hex id: ${hex.id}.`);
    } else if (`${hex.q},${hex.r}` !== expectedCoordinate) {
      errors.push(`Hex ${hex.id} has coordinate ${hex.q},${hex.r}; expected ${expectedCoordinate}.`);
    }
  }

  const resourceCounts = countValues(board.hexes.map((hex) => hex.resource));
  if (!sameCounts(resourceCounts, CATAN_RESOURCE_DISTRIBUTION)) {
    errors.push(`Invalid resource distribution: ${JSON.stringify(resourceCounts)}.`);
  }

  const producingNumbers = board.hexes
    .filter((hex) => hex.resource !== "desert")
    .map((hex) => hex.number);
  const numberCounts = countValues(producingNumbers);
  const expectedNumberCounts = countValues(CATAN_NUMBER_TOKENS);
  if (!sameCounts(numberCounts, expectedNumberCounts)) {
    errors.push(`Invalid number-token distribution: ${JSON.stringify(numberCounts)}.`);
  }

  for (const hex of board.hexes) {
    if (hex.resource === "desert" && hex.number !== null) {
      errors.push(`Desert ${hex.id} must have a null number token.`);
    }
    if (hex.resource !== "desert" && !Object.hasOwn(CATAN_PIPS, hex.number)) {
      errors.push(`Producing hex ${hex.id} has invalid number token ${String(hex.number)}.`);
    }
  }

  if (hasAdjacentRedTokens(board.hexes)) {
    errors.push("A 6 or 8 is adjacent to another 6 or 8.");
  }

  if (CATAN_VERTICES.length !== 54) {
    errors.push(`Fixed topology should contain 54 vertices; found ${CATAN_VERTICES.length}.`);
  }
  if (CATAN_EDGES.length !== 72) {
    errors.push(`Fixed topology should contain 72 edges; found ${CATAN_EDGES.length}.`);
  }
  for (const vertex of CATAN_VERTICES) {
    if (vertex.adjacentHexIds.length < 1 || vertex.adjacentHexIds.length > 3) {
      errors.push(`${vertex.id} touches ${vertex.adjacentHexIds.length} hexes; expected 1-3.`);
    }
    for (const hexId of vertex.adjacentHexIds) {
      if (!seenHexIds.has(hexId)) errors.push(`${vertex.id} refers to missing ${hexId}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateCatanBoards(boards = CATAN_BOARDS) {
  const results = boards.map((board) => ({
    boardId: board.id,
    ...validateCatanBoard(board),
  }));
  const signatures = boards.map((board) =>
    board.hexes.map((hex) => `${hex.resource}:${hex.number ?? "D"}`).join("|"),
  );
  const duplicateLayoutCount = signatures.length - new Set(signatures).size;
  return {
    valid: results.every((result) => result.valid) && duplicateLayoutCount === 0,
    duplicateLayoutCount,
    results,
  };
}

function requireVertex(board, vertexId) {
  const vertex = (board.vertices ?? CATAN_VERTICES).find((candidate) => candidate.id === vertexId);
  if (!vertex) throw new RangeError(`Unknown Catan vertex: ${String(vertexId)}.`);
  return vertex;
}

/**
 * Score one settlement. Pips are the primary measure; distinct resources earn
 * a transparent bonus of 0/1/3 points for one/two/three resource types.
 */
export function scoreCatanVertex(board, vertexId) {
  const vertex = requireVertex(board, vertexId);
  const hexById = new Map(board.hexes.map((hex) => [hex.id, hex]));
  const productionByResource = {};
  let pipCount = 0;

  for (const hexId of vertex.adjacentHexIds) {
    const hex = hexById.get(hexId);
    if (!hex || hex.resource === "desert") continue;
    const pips = CATAN_PIPS[hex.number] ?? 0;
    pipCount += pips;
    productionByResource[hex.resource] = (productionByResource[hex.resource] ?? 0) + pips;
  }

  const resources = Object.keys(productionByResource).sort();
  const diversity = resources.length;
  const diversityBonus = diversity >= 3 ? 3 : diversity === 2 ? 1 : 0;

  return {
    vertexId,
    pipCount,
    diversity,
    diversityBonus,
    score: pipCount + diversityBonus,
    resources,
    productionByResource,
    adjacentHexIds: [...vertex.adjacentHexIds],
    portIds: [...vertex.portIds],
  };
}

export function rankCatanVertices(board) {
  const ranked = (board.vertices ?? CATAN_VERTICES)
    .map((vertex) => scoreCatanVertex(board, vertex.id))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.pipCount - a.pipCount ||
        b.diversity - a.diversity ||
        a.vertexId.localeCompare(b.vertexId),
  );
  const denominator = Math.max(1, ranked.length - 1);
  let currentRank = 0;
  let previous = null;
  return ranked.map((entry, index) => {
    if (!previous || entry.score !== previous.score || entry.pipCount !== previous.pipCount || entry.diversity !== previous.diversity) {
      currentRank = index + 1;
    }
    previous = entry;
    return {
      ...entry,
      rank: currentRank,
      percentile: Math.round((1000 * (ranked.length - currentRank)) / denominator) / 10,
    };
  });
}

function areNeighborVertices(board, firstVertexId, secondVertexId) {
  return requireVertex(board, firstVertexId).neighborVertexIds.includes(secondVertexId);
}

export function scoreCatanPlacementPair(board, vertexIds) {
  const normalized = [...new Set(vertexIds ?? [])];
  if (normalized.length !== 2) {
    return {
      valid: false,
      reason: "Choose two different settlement vertices.",
      vertexIds: normalized,
      totalScore: null,
    };
  }
  const [firstVertexId, secondVertexId] = normalized;
  // Catan's distance rule forbids settlements at the two ends of one road edge.
  if (areNeighborVertices(board, firstVertexId, secondVertexId)) {
    return {
      valid: false,
      reason: "Those intersections are adjacent and violate Catan's distance rule.",
      vertexIds: normalized,
      totalScore: null,
    };
  }

  const settlements = normalized.map((vertexId) => scoreCatanVertex(board, vertexId));
  const combinedResources = [...new Set(settlements.flatMap((entry) => entry.resources))].sort();
  // Small pair-level reward for covering four or all five producing resources.
  const coverageBonus = Math.max(0, combinedResources.length - 3) * 0.75;
  const baseScore = settlements.reduce((sum, entry) => sum + entry.score, 0);
  return {
    valid: true,
    reason: null,
    vertexIds: normalized,
    settlements,
    pipCount: settlements.reduce((sum, entry) => sum + entry.pipCount, 0),
    combinedResources,
    combinedDiversity: combinedResources.length,
    coverageBonus,
    baseScore,
    totalScore: baseScore + coverageBonus,
  };
}

export function rankCatanPlacementPairs(board) {
  const vertices = board.vertices ?? CATAN_VERTICES;
  const pairs = [];
  for (let first = 0; first < vertices.length - 1; first += 1) {
    for (let second = first + 1; second < vertices.length; second += 1) {
      const pair = scoreCatanPlacementPair(board, [vertices[first].id, vertices[second].id]);
      if (pair.valid) pairs.push(pair);
    }
  }

  pairs.sort(
    (a, b) =>
      b.totalScore - a.totalScore ||
      b.pipCount - a.pipCount ||
      b.combinedDiversity - a.combinedDiversity ||
      a.vertexIds.join("-").localeCompare(b.vertexIds.join("-")),
  );
  const denominator = Math.max(1, pairs.length - 1);
  let currentRank = 0;
  let previous = null;
  return pairs.map((pair, index) => {
    if (!previous || pair.totalScore !== previous.totalScore || pair.pipCount !== previous.pipCount || pair.combinedDiversity !== previous.combinedDiversity) {
      currentRank = index + 1;
    }
    previous = pair;
    return {
      ...pair,
      rank: currentRank,
      percentile: Math.round((1000 * (pairs.length - currentRank)) / denominator) / 10,
    };
  });
}

function ratingForScore(correctnessPercent) {
  if (correctnessPercent >= 97) return "Optimal";
  if (correctnessPercent >= 90) return "Excellent";
  if (correctnessPercent >= 75) return "Strong";
  if (correctnessPercent >= 55) return "Developing";
  return "Needs another look";
}

/**
 * Grade two taps against both the individual top-N and all legal two-spot pairs.
 * This intentionally returns a percentile/rating rather than binary right/wrong.
 */
export function gradeCatanPlacements(board, selectedVertexIds, { topN = 5 } = {}) {
  const normalizedTopN = Math.max(1, Math.floor(topN));
  let selectedPair;
  try {
    selectedPair = scoreCatanPlacementPair(board, selectedVertexIds);
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : String(error),
      rating: "Incomplete",
      correctnessPercent: 0,
    };
  }

  if (!selectedPair.valid) {
    return {
      ...selectedPair,
      rating: "Incomplete",
      correctnessPercent: 0,
    };
  }

  const vertexRanking = rankCatanVertices(board);
  const vertexRankById = new Map(vertexRanking.map((entry) => [entry.vertexId, entry]));
  const individualResults = selectedPair.vertexIds.map((vertexId) => {
    const result = vertexRankById.get(vertexId);
    return { ...result, inTopN: result.rank <= normalizedTopN };
  });

  const pairRanking = rankCatanPlacementPairs(board);
  const selectedKey = [...selectedPair.vertexIds].sort().join("|");
  const pairResult = pairRanking.find(
    (entry) => [...entry.vertexIds].sort().join("|") === selectedKey,
  );
  const averageIndividualPercentile =
    individualResults.reduce((sum, entry) => sum + entry.percentile, 0) /
    individualResults.length;
  const correctnessPercent = Math.round(
    pairResult.percentile * 0.65 + averageIndividualPercentile * 0.35,
  );
  const rating = ratingForScore(correctnessPercent);
  const topVertexSummary = vertexRanking
    .slice(0, normalizedTopN)
    .map((entry) => entry.vertexId)
    .join(", ");
  const settlementSummary = individualResults
    .map(
      (entry) =>
        `${entry.vertexId}: ${entry.pipCount} pips across ${entry.diversity} resource type${
          entry.diversity === 1 ? "" : "s"
        } (rank ${entry.rank})`,
    )
    .join("; ");

  return {
    valid: true,
    rating,
    correctnessPercent,
    topN: normalizedTopN,
    bothInTopN: individualResults.every((entry) => entry.inTopN),
    individualResults,
    pair: pairResult,
    legalPairCount: pairRanking.length,
    bestPair: pairRanking[0],
    topVertexIds: vertexRanking.slice(0, normalizedTopN).map((entry) => entry.vertexId),
    explanation: `${settlementSummary}. Together they cover ${selectedPair.combinedDiversity} resources and rank ${pairResult.rank} of ${pairRanking.length} legal pairs (${pairResult.percentile}th percentile). Top-${normalizedTopN} individual spots: ${topVertexSummary}.`,
  };
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatNumber(value) {
  return Number(value.toFixed(2));
}

function renderPipDots(number, centerX, centerY) {
  const count = CATAN_PIPS[number] ?? 0;
  if (count === 0) return "";
  const spacing = 4.2;
  const startX = centerX - ((count - 1) * spacing) / 2;
  return Array.from(
    { length: count },
    (_, index) =>
      `<circle cx="${formatNumber(startX + index * spacing)}" cy="${formatNumber(
        centerY,
      )}" r="1.25" fill="#3a3029" aria-hidden="true"/>`,
  ).join("");
}

/**
 * Return one self-contained SVG string. Every intersection carries
 * data-vertex-id, role=button, and tabindex=0 for delegated touch/keyboard UI.
 */
export function renderCatanBoard(board, selections = [], revealTopIds = []) {
  const selectedIds = new Set(selections ?? []);
  const revealedIds = new Set(revealTopIds ?? []);
  const size = 54;
  const scaledVertices = (board.vertices ?? CATAN_VERTICES).map((vertex) => ({
    ...vertex,
    screenX: vertex.x * size,
    screenY: vertex.y * size,
  }));
  const vertexById = new Map(scaledVertices.map((vertex) => [vertex.id, vertex]));
  const xs = scaledVertices.map((vertex) => vertex.screenX);
  const ys = scaledVertices.map((vertex) => vertex.screenY);
  const margin = 84;
  const minX = Math.min(...xs) - margin;
  const minY = Math.min(...ys) - margin;
  const width = Math.max(...xs) - Math.min(...xs) + margin * 2;
  const height = Math.max(...ys) - Math.min(...ys) + margin * 2;

  const edgeMarkup = (board.edges ?? CATAN_EDGES)
    .map((edge) => {
      const first = vertexById.get(edge.vertexIds[0]);
      const second = vertexById.get(edge.vertexIds[1]);
      return `<line x1="${formatNumber(first.screenX)}" y1="${formatNumber(
        first.screenY,
      )}" x2="${formatNumber(second.screenX)}" y2="${formatNumber(
        second.screenY,
      )}" class="catan-edge"/>`;
    })
    .join("");

  const hexMarkup = board.hexes
    .map((hex) => {
      const center = axialToPoint(hex.q, hex.r);
      const centerX = center.x * size;
      const centerY = center.y * size;
      const points = hexCorners(hex.q, hex.r)
        .map((point) => `${formatNumber(point.x * size)},${formatNumber(point.y * size)}`)
        .join(" ");
      const resourceLabel = RESOURCE_LABELS[hex.resource] ?? hex.resource;
      const numberMarkup =
        hex.number === null
          ? `<text x="${formatNumber(centerX)}" y="${formatNumber(
              centerY + 5,
            )}" class="catan-desert-label">Desert</text>`
          : `<circle cx="${formatNumber(centerX)}" cy="${formatNumber(
              centerY,
            )}" r="17" class="catan-token"/><text x="${formatNumber(
              centerX,
            )}" y="${formatNumber(centerY + 3)}" class="catan-number${
              hex.number === 6 || hex.number === 8 ? " catan-number-red" : ""
            }">${hex.number}</text>${renderPipDots(hex.number, centerX, centerY + 9)}`;
      return `<g class="catan-hex" data-hex-id="${escapeXml(hex.id)}" data-resource="${escapeXml(
        hex.resource,
      )}" data-number="${hex.number ?? ""}"><polygon points="${points}" fill="${
        RESOURCE_COLORS[hex.resource] ?? "#cccccc"
      }"><title>${escapeXml(resourceLabel)}${
        hex.number === null ? "" : `, number ${hex.number}`
      }</title></polygon>${numberMarkup}</g>`;
    })
    .join("");

  const portMarkup = (board.ports ?? CATAN_PORTS)
    .map((port) => {
      const first = vertexById.get(port.vertexIds[0]);
      const second = vertexById.get(port.vertexIds[1]);
      const midpointX = (first.screenX + second.screenX) / 2;
      const midpointY = (first.screenY + second.screenY) / 2;
      const length = Math.hypot(midpointX, midpointY) || 1;
      const labelX = midpointX + (midpointX / length) * 32;
      const labelY = midpointY + (midpointY / length) * 32;
      const label = port.type === "generic" ? "3:1" : `2:1 ${port.type}`;
      return `<g class="catan-port" data-port-id="${escapeXml(port.id)}"><line x1="${formatNumber(
        first.screenX,
      )}" y1="${formatNumber(first.screenY)}" x2="${formatNumber(
        labelX,
      )}" y2="${formatNumber(labelY)}"/><line x1="${formatNumber(
        second.screenX,
      )}" y1="${formatNumber(second.screenY)}" x2="${formatNumber(
        labelX,
      )}" y2="${formatNumber(labelY)}"/><circle cx="${formatNumber(
        labelX,
      )}" cy="${formatNumber(labelY)}" r="14"/><text x="${formatNumber(
        labelX,
      )}" y="${formatNumber(labelY + 3)}">${escapeXml(label)}</text></g>`;
    })
    .join("");

  const vertexMarkup = scaledVertices
    .map((vertex) => {
      const selected = selectedIds.has(vertex.id);
      const revealed = revealedIds.has(vertex.id);
      const accessibleLabel = `Settlement ${vertex.id}; touches ${vertex.adjacentHexIds.join(
        ", ",
      )}`;
      return `<g class="catan-vertex-target" data-vertex-id="${escapeXml(
        vertex.id,
      )}" data-selected="${selected ? "true" : "false"}" role="button" tabindex="0" aria-pressed="${
        selected ? "true" : "false"
      }" aria-label="${escapeXml(accessibleLabel)}"><circle cx="${formatNumber(
        vertex.screenX,
      )}" cy="${formatNumber(vertex.screenY)}" r="18" class="catan-vertex-hit"/><circle cx="${formatNumber(
        vertex.screenX,
      )}" cy="${formatNumber(vertex.screenY)}" r="${
        selected || revealed ? 8.5 : 6.25
      }" class="catan-vertex${selected ? " selected" : ""}${
        revealed ? " revealed top-choice" : ""
      }"><title>${escapeXml(accessibleLabel)}</title></circle></g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${formatNumber(
    minX,
  )} ${formatNumber(minY)} ${formatNumber(width)} ${formatNumber(
    height,
  )}" class="catan-board" role="img" aria-label="Catan starting-settlement puzzle for ${escapeXml(
    board.id,
  )}" preserveAspectRatio="xMidYMid meet"><style>
    .catan-board { width: 100%; height: auto; touch-action: manipulation; }
    .catan-hex polygon { stroke: #f7f0df; stroke-width: 3; stroke-linejoin: round; }
    .catan-edge { stroke: #6d4d32; stroke-width: 1.8; pointer-events: none; }
    .catan-token { fill: #f5ead1; stroke: #8e795b; stroke-width: 1.2; }
    .catan-number, .catan-desert-label { fill: #28231f; font: 700 12px system-ui, sans-serif; text-anchor: middle; pointer-events: none; }
    .catan-number-red { fill: #b7332b; }
    .catan-desert-label { font-size: 9px; }
    .catan-port line { stroke: #6d4d32; stroke-width: 1.5; pointer-events: none; }
    .catan-port circle { fill: #f6f0e5; stroke: #6d4d32; stroke-width: 1.4; pointer-events: none; }
    .catan-port text { fill: #3c332b; font: 600 6px system-ui, sans-serif; text-anchor: middle; pointer-events: none; }
    .catan-vertex-target { cursor: pointer; outline: none; }
    .catan-vertex-hit { fill: transparent; stroke: none; }
    .catan-vertex { fill: #172338; stroke: #dce7fa; stroke-width: 2.2; pointer-events: none; vector-effect: non-scaling-stroke; }
    .catan-vertex-target:hover .catan-vertex, .catan-vertex-target:focus .catan-vertex { fill: #81a8ff; }
    .catan-vertex.selected { fill: #c6f54d; stroke: #182313; stroke-width: 3.2; }
    .catan-vertex.revealed { fill: #ffb26b; }
    .catan-vertex.top-choice { stroke: #c6f54d; stroke-width: 3.2; }
  </style>${portMarkup}${hexMarkup}${edgeMarkup}${vertexMarkup}</svg>`;
}

/**
 * Runtime adapter used by app.js. It preserves the richer grading result while
 * exposing the concise fields the mobile feedback view consumes.
 */
export function gradeCatanPlacement(board, selectedIds, { topN = 5 } = {}) {
  const normalizedTopN = Math.max(1, Math.floor(topN));
  const vertexRanking = rankCatanVertices(board);
  const topVertices = vertexRanking.filter(entry => entry.rank <= normalizedTopN);
  const topVertexIds = topVertices.map((entry) => entry.vertexId);
  const requestedIds = [...new Set(selectedIds ?? [])];
  const selected = requestedIds.flatMap((id) => {
    try {
      const score = scoreCatanVertex(board, id);
      const ranked = vertexRanking.find((entry) => entry.vertexId === id);
      return [{
        id,
        pips: score.pipCount,
        diversity: score.diversity,
        score: score.score,
        diversityBonus: score.diversityBonus,
        resources: score.resources,
        productionByResource: score.productionByResource,
        rank: ranked?.rank ?? null,
        percentile: ranked?.percentile ?? 0,
      }];
    } catch {
      return [];
    }
  });
  const result = gradeCatanPlacements(board, requestedIds, { topN: normalizedTopN });

  if (!result.valid) {
    return {
      percentile: 0,
      rating: "Illegal placement",
      explanation: `${result.reason ?? "Choose two legal settlement spots."} The highlighted intersections are the top-${normalizedTopN} individual production spots.`,
      topVertexIds,
      selected,
      valid: false,
      reason: result.reason,
    };
  }

  const percentile = result.pair.percentile;
  const bestPairIds = result.bestPair.vertexIds.join(" and ");
  const topCount = result.individualResults.filter((entry) => entry.inTopN).length;
  return {
    percentile,
    rating: ratingForScore(percentile),
    explanation: `Your pair ranks ${result.pair.rank} of ${result.legalPairCount} legal pairs and covers ${result.pair.combinedDiversity} resource types. ${topCount} of your 2 spots made the individual top ${normalizedTopN}; the highest-scoring pair is ${bestPairIds}.`,
    topVertexIds,
    selected,
    valid: true,
    pairRank: result.pair.rank,
    bestPair: result.bestPair,
    bothInTopN: result.bothInTopN,
  };
}

const initialValidation = validateCatanBoards(CATAN_BOARDS);
if (!initialValidation.valid) {
  throw new Error(`Built-in Catan boards failed validation: ${JSON.stringify(initialValidation)}`);
}
