import "@testing-library/jest-dom/vitest";

// cmdk uses ResizeObserver; jsdom doesn't ship one.
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;

// cmdk calls scrollIntoView on selected items; jsdom doesn't implement it.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}
