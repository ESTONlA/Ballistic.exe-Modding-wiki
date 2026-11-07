# Ballistic Modding Wiki

[![Game coverage: approximately 10%](https://img.shields.io/badge/Game_coverage-~10%25-5b8def?style=for-the-badge&labelColor=20232a)](docs/coverage.html)
[![25 guides](https://img.shields.io/badge/Guides-25-5b8def?style=for-the-badge&labelColor=20232a)](docs/introduction.html#guide-index)

Setup notes, Lua guides and game references for modding Ballistic.exe.

There are 25 guides now, including weapons, attachments, stats, shot/hit events, targets, scoring, workshop UI, ranges, saves and multiplayer architecture. The [coverage page](docs/coverage.html) lists what’s covered and what still needs research. The percentage is still a rough estimate, not an audited count of the whole game.

## Run locally

```sh
npm run dev
```

No dependencies to install. You just need Node.js. Stop the preview with Ctrl+C.

You can also open `docs/introduction.html` straight in your browser. Some browsers restrict copying code when opening local files, so use the preview server if the copy buttons don’t work.

## Where everything lives

```text
docs/                   Individual HTML guides
assets/css/site.css     Styles and both color themes
assets/js/site.js       Navigation, search and page controls
assets/js/navigation.js Page titles, order and sidebar groups
assets/js/theme.js      Applies the saved theme before rendering
assets/js/search-index.js
                        Generated search data
tools/build.mjs         Checks links and builds the site
tools/serve.mjs         Local preview server
.github/workflows/      Manual GitHub Pages deployment
```

Edit the text inside `<article>` in any `docs/*.html` file. Give section headings an `id`; the table of contents picks them up automatically.

The sidebar’s page list is in `assets/js/navigation.js`. Add a guide there and create its HTML file; the build checks that they match. CSS stays in `assets/css/site.css`.

Dark mode is on by default. The theme toggle remembers your choice.

## Build

```sh
npm run check
```

This checks the JavaScript, local links and heading anchors, updates search, and puts the finished site in `dist/`.

## GitHub Pages

Upload the project to your repo, set **Settings → Pages → Source** to **GitHub Actions**, then run **Deploy documentation** from the Actions tab.

The workflow is manual. It won’t deploy on every push.

## Contributing

Found a mistake, figured something out, or want to improve a guide? PRs are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening one—it covers editing, checks and what to include.
