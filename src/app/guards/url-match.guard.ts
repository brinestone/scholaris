import { CanMatchFn } from '@angular/router';

/** 
 * Checks whether a url with id path param matches a valid pattern.
 * */
export const urlIdCheckMatchGuard: (pattern: RegExp) => CanMatchFn = (pattern: RegExp) => (route, segments) => {
  return pattern.test(segments[0].path);
};
