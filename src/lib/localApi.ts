import LZString from "lz-string";

// Types
export type Entity = Record<string, unknown> & { id?: number };
export type TableName = "characters" | "attacks" | "items" | "spells" | "rolls";

const tables: TableName[] = [
  "characters",
  "attacks",
  "items",
  "spells",
  "rolls",
];

// In-memory store (cleared on page refresh)
const db: Record<TableName, Entity[]> = {
  characters: [],
  attacks: [],
  items: [],
  spells: [],
  rolls: [],
};

function nextId(rows: Entity[]): number {
  return rows.length ? Math.max(...rows.map((r) => (r.id as number))) + 1 : 1;
}

// -----------------------------------------------
// Minimal router that mimics the REST endpoints
// -----------------------------------------------
async function router(url: URL, init: RequestInit = {}): Promise<Response> {
  const [, , resource, id] = url.pathname.split("/");
  const table = resource as TableName;
  if (!tables.includes(table)) {
    return new Response("Not found", { status: 404 });
  }

  let rows = db[table];
  const method = (init.method || "GET").toUpperCase();

  if (method === "GET") {
    if (id) {
      const row = rows.find((r) => r.id === Number(id));
      return row ? Response.json(row) : new Response("Not found", { status: 404 });
    }
    return Response.json(rows);
  }

  if (method === "POST") {
    const body = (init.body ? JSON.parse(init.body as string) : {}) as Entity;
    const created = { id: nextId(rows), ...body };
    rows.push(created);
    db[table] = rows;
    return new Response(JSON.stringify(created), { status: 201 });
  }

  if (method === "PATCH") {
    if (!id) return new Response("Missing id", { status: 400 });
    const body = (init.body ? JSON.parse(init.body as string) : {}) as Partial<Entity>;
    const idx = rows.findIndex((r) => r.id === Number(id));
    if (idx === -1) return new Response("Not found", { status: 404 });
    rows[idx] = { ...rows[idx], ...body };
    db[table] = rows;
    return Response.json(rows[idx]);
  }

  if (method === "DELETE") {
    if (!id) return new Response("Missing id", { status: 400 });
    rows = rows.filter((r) => r.id !== Number(id));
    db[table] = rows;
    return new Response(null, { status: 204 });
  }

  return new Response("Unsupported method", { status: 400 });
}

// -----------------------------------------------
// Monkey-patch fetch
// -----------------------------------------------
const realFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(typeof input === "string" ? input : (input as Request).url, window.location.origin);
  if (url.pathname.startsWith("/api/")) {
    return router(url, init);
  }
  return realFetch(input, init);
};

// -----------------------------------------------
// Export / Import helpers
// -----------------------------------------------
export function exportAllData(): string {
  const dump: Record<TableName, unknown[]> = Object.fromEntries(
    tables.map((t) => [t, db[t]])
  ) as Record<TableName, unknown[]>;
  return LZString.compressToEncodedURIComponent(JSON.stringify(dump));
}

export function importAllData(compressed: string) {
  const json = LZString.decompressFromEncodedURIComponent(compressed);
  if (!json) {
    throw new Error("Invalid data string");
  }
  const parsed = JSON.parse(json) as Record<TableName, unknown[]>;
  tables.forEach((t) => {
    db[t] = (parsed[t] as Entity[]) ?? [];
  });
} 