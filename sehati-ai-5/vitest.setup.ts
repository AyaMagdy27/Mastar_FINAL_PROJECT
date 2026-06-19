import '@testing-library/jest-dom';

const mockIntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = mockIntersectionObserver as any;
