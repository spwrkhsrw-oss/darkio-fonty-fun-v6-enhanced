# Darkio Fonty Fun V6.1 — 6.1.0

V6.1 expands customization and repairs runtime discovery: it resolves the React/React Native and patcher APIs from Classic globals and the scoped/unscoped API passed by Revenge. It supports both common before-hook argument orders, adds a direct wrapper fallback when no patcher is exposed, intercepts React `createElement` and JSX runtime factories, and recursively handles pre-created React elements in text children.

## Installation

1. Extract the package ZIP. Upload its **contents** to the root of the same repository, replacing each file at the matching path.
2. Keep GitHub Pages enabled at **Settings → Pages → Deploy from a branch → main → /(root)**.
3. Open the published Pages URL and use the repository URL format accepted by your Revenge Classic build. If you use a direct plugin install, you can also import the package ZIP from Revenge's plugin repository settings.
4. Refresh/update or reinstall the plugin, enable it in Revenge, then enable styling in the plugin settings.

## Twelve customization fields

1. Enable styling: `0` off / `1` on.
2. Display name: the text to match.
3. Unicode font ID: `0–20`.
4. Color/effect ID: `0–12`, `#RRGGBB`, or `off`.
5. Animation speed: `0` off, `1` very slow, `2` slow, `3` normal, `4` fast.
6. Name matching: `0` exact, `1` contains, `2` starts with.
7. Case sensitivity: `0` ignore case, `1` case-sensitive.
8. Text style: `0` normal, `1` bold, `2` italic, `3` bold + italic.
9. Letter spacing: `0` normal, `1` loose, `2` wide.
10. Secondary color: hex color for custom cycle.
11. Reverse animation: `0` off, `1` on.
12. Reduce motion: `0` allow animation, `1` stop animation.

### Unicode font IDs (0–20)

| ID | Font |
|---:|---|
| 0 | gg sans |
| 1 | Tempo |
| 2 | Sakura |
| 3 | Jellybean |
| 4 | Modern |
| 5 | Medieval |
| 6 | 8Bit |
| 7 | Vampyre |
| 8 | Monkey Bars |
| 9 | Mainframe |
| 10 | Headbang |
| 11 | Journal |
| 12 | Bold Serif |
| 13 | Italic Serif |
| 14 | Bold Italic |
| 15 | Bold Fraktur |
| 16 | Double-Struck |
| 17 | Small Caps |
| 18 | Fullwidth |
| 19 | Sans Italic |
| 20 | Bubble Letters |

### Color/effect IDs (0–12)

| ID | Effect |
|---:|---|
| 0 | Solid custom color |
| 1 | Rainbow |
| 2 | Ocean |
| 3 | Sunset |
| 4 | Aurora |
| 5 | Neon Pulse |
| 6 | Gummy |
| 7 | Fire |
| 8 | Ice |
| 9 | Rose |
| 10 | Mint |
| 11 | Cosmic |
| 12 | Custom Cycle |

## Validation and limitations

The package should be syntax-checked and manifest/hash-checked before use. Runtime availability differs by Revenge Classic version, so this package also needs on-device validation. The settings screen shows which rendering hooks were attached and how many matching strings have been seen, helping distinguish a patch-install issue from a name-matching issue. This plugin changes local rendering only; it does not change your public Discord profile name or send network requests.
