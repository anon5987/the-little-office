/**
 * Office 1 GABC Barrel Export
 * Aggregates all GABC content for Office 1 (Ordinary Time)
 */

import antiphons from './vespers-antiphons.js';
import hymnAndVersicles from './vespers-hymn.js';
import psalms from './psalms.js';

export default {
  ...antiphons,
  ...hymnAndVersicles,
  ...psalms
};

export { antiphons, hymnAndVersicles, psalms };
