# Changelog

## v2

- Added types definitions and types tests with `check-dts`.
- [breaking] Removed `node-fetch` peer dependency and requiring Node 18+. For lower Node versions, use `translate@1` + `node-fetch`. No changes in the browser.
- Renamed cache required param from `cache.put()` to `cache.set()`
- Removed unused param from cache
- Removed unneeded ISO codes, since one was a strict derivation from the other ~> -10% code size!
- Added Github testing CI and Readme badges

## v1

- Initial release
