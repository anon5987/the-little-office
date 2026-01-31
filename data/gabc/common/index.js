/**
 * Common GABC Barrel Export
 * Aggregates all common GABC content used across all hours
 */

import opening from './opening.js';
import closing from './closing.js';

export default {
  ...opening,
  ...closing
};

export { opening, closing };
