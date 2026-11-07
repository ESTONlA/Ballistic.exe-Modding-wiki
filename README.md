# Ballistic Modding Wiki

[![Game coverage: approximately 10%](https://img.shields.io/badge/Game_coverage-~10%25-5b8def?style=for-the-badge&labelColor=20232a)](docs/coverage.html)
[![60 guides](https://img.shields.io/badge/Guides-60-5b8def?style=for-the-badge&labelColor=20232a)](docs/introduction.html#guide-index)

Setup notes, Lua guides and game references for modding Ballistic.exe.

There are 60 guides covering the practical modding workflow: Lua, reflection, containers, transforms, weapons, ammunition, targets, UI, runtime assets, physics, sound, effects, saves and networking. The [coverage page](docs/coverage.html) maps the topics and records the remaining research gaps. The percentage is still a rough estimate, not an audited count of the whole game.

Start with [your first mod](docs/first-mod.html), learn the [Lua basics](docs/lua-basics.html), then [build a read-only weapon inspector](docs/workshop-inspector.html). The inspector includes all four Lua files and a downloadable example. Follow [the testing guide](docs/testing.html) to check your own result.

New pages, corrections and site changes go in the [changelog](docs/changelog.html).

Looking up something specific? Try the [hook reference](docs/hook-reference.html), [glossary](docs/glossary.html) or [troubleshooting FAQ](docs/faq.html). Search ranks page titles and section headings, and matching results can jump straight to the relevant section.

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
assets/examples/        Source files for downloadable teaching examples
assets/downloads/       Example archives rebuilt with the site
assets/data/            Curated observed-hook metadata
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

For the inspector example, edit the Lua files in `assets/examples/WorkshopInspector/Scripts/`. The build updates the guide’s matching code blocks and rebuilds the six-file example archive, so the displayed code and download stay together.

The hook catalog is generated from `assets/data/observed-hooks.json`. Keep its evidence labels and test limits accurate; the build doesn’t inspect a running game.

## GitHub Pages

Upload the project to your repo, set **Settings → Pages → Source** to **GitHub Actions**, then run **Deploy documentation** from the Actions tab.

The workflow is manual. It won’t deploy on every push.

## Contributing

Found a mistake, figured something out, or want to improve a guide? PRs are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening one—it covers editing, checks and what to include.
