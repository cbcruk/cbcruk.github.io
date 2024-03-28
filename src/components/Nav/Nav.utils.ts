import { match, type MatchFunction } from "path-to-regexp"

type Pathname = Parameters<MatchFunction<object>>[0]

export function isMatched(pathname: Pathname) {
  return (paths: Array<Pathname>) => {
    return paths.map(path => match(path)).some(fn => fn(pathname))
  }
}