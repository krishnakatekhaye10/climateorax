// Polyfill ResizeObserver for tests (used by recharts ResponsiveContainer)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = global.ResizeObserver || ResizeObserver;
