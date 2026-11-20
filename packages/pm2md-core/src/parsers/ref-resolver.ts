// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

const MAX_REF_DEPTH = 32;

function decodePointerSegment(segment: string): string {
  return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

/**
 * Resolve a local JSON Pointer (`#/...`) within `rootDoc`.
 */
export function resolveJsonPointer(
  rootDoc: Record<string, unknown>,
  pointer: string
): unknown {
  if (!pointer.startsWith("#/")) {
    return undefined;
  }
  const segments = pointer.slice(2).split("/").map(decodePointerSegment);
  let current: unknown = rootDoc;

  for (const segment of segments) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }
    if (Array.isArray(current)) {
      const idx = Number(segment);
      if (!Number.isInteger(idx) || idx < 0 || idx >= current.length) {
        return undefined;
      }
      current = current[idx];
    } else {
      current = (current as Record<string, unknown>)[segment];
    }
  }
  return current;
}

/**
 * Dereference `$ref` objects recursively with cycle detection and depth limits.
 */
export function dereferenceObject<T = unknown>(
  value: unknown,
  rootDoc: Record<string, unknown>,
  visited: Set<string> = new Set(),
  depth = 0
): T {
  if (
    value === null ||
    typeof value !== "object" ||
    depth > MAX_REF_DEPTH
  ) {
    return value as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      dereferenceObject(item, rootDoc, visited, depth + 1)
    ) as unknown as T;
  }

  const obj = value as Record<string, unknown>;
  if (typeof obj.$ref === "string") {
    const ref = obj.$ref;
    if (visited.has(ref)) {
      return { $circularRef: ref } as unknown as T;
    }
    const target = resolveJsonPointer(rootDoc, ref);
    if (target === undefined) {
      return value as T;
    }
    const nextVisited = new Set(visited);
    nextVisited.add(ref);
    const resolvedTarget = dereferenceObject<Record<string, unknown>>(
      target,
      rootDoc,
      nextVisited,
      depth + 1
    );

    if (
      resolvedTarget &&
      typeof resolvedTarget === "object" &&
      !Array.isArray(resolvedTarget)
    ) {
      const siblings: Record<string, unknown> = { ...obj };
      delete siblings.$ref;
      const resolvedSiblings = dereferenceObject<Record<string, unknown>>(
        siblings,
        rootDoc,
        nextVisited,
        depth + 1
      );
      return { ...resolvedTarget, ...resolvedSiblings } as unknown as T;
    }
    return resolvedTarget as unknown as T;
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    out[key] = dereferenceObject(val, rootDoc, visited, depth + 1);
  }
  return out as T;
}
