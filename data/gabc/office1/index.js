/**
 * Office 1 GABC Barrel Export
 * Aggregates all GABC content for Office 1 (Ordinary Time)
 */

import antiphons from './antiphons.js';
import hymnAndVersicles from './hymns.js';
import psalms from './psalms.js';

export default {
  ...antiphons,
  ...hymnAndVersicles,
  ...psalms
};

export { antiphons, hymnAndVersicles, psalms };
