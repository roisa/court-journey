/**
 * Lightweight unique id generator.
 * crypto.randomUUID isn't reliably available on the Hermes engine, so we use a
 * timestamp + random suffix. Good enough for local-first client ids.
 */
export function uid(prefix = ''): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}${ts}${rand}`;
}
