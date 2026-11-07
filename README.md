# Ballistic Modding Wiki

Setup notes, Lua guides and game references for modding Ballistic.exe.

## Coverage

**About 10% of the game's modding systems documented so far.** This is a rough estimate based on the demo, not a measured count of every class or asset.

Covered: UE4SS setup, a first Lua mod, hooks, object lookup, debugging, and a few workshop functions and game paths.

Still to document: weapon and attachment systems in depth, ammunition and ballistics, targets and scoring, progression and saves, and detailed UI and range behaviour.

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
assets/js/theme.js      Applies the saved theme before rendering
assets/js/search-index.js
                        Generated search data
tools/build.mjs         Checks links and builds the site
tools/serve.mjs         Local preview server
.github/workflows/      Manual GitHub Pages deployment
```

Edit the text inside `<article>` in any `docs/*.html` file. Give section headings an `id`; the table of contents picks them up automatically.

The sidebar’s page list is at the top of `assets/js/site.js`. CSS stays in `assets/css/site.css`.

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
