# Contributing

Corrections, better examples and new guides are welcome. You don’t have to rewrite a whole page to help—a fixed path or a clearer explanation is useful too.

## Making a change

1. Fork the repo and create a branch for your change.
2. Edit the relevant guide in `docs/`. Layout and shared controls live in `assets/`; the README explains the file layout.
3. Run `npm run check` from the project folder. There’s nothing to install first; the scripts only need Node.js.
4. Open the site and check the page you changed. For layout changes, check a narrow phone-sized window too.
5. Open a PR explaining what changed and why. Include a screenshot if you changed how the site looks.

Keep each PR focused so it’s easy to review. If you’re planning a bigger rework, open an issue first so we can talk it through.

## Writing guides

Write like you’re explaining it to another modder. Get to the steps, use real examples, and explain anything needed to follow them. Skip the sales pitch.

- Keep one main heading per page and give each section heading a unique `id`.
- Use relative links between guides, such as `hooks.html#find-a-function`.
- Keep styles in the CSS file and shared behaviour in JavaScript.
- When adding a page, update the sidebar list in `assets/js/site.js` and the expected page count in `tools/build.mjs`. Run the check again to rebuild the search index.
- Don’t edit `search-index.js` or `dist/` by hand; they’re generated.

## Game-specific findings

Include the game build and UE4SS version you tested, along with the steps needed to reproduce the result. If you haven’t tested something, say so. A function appearing in an object dump doesn’t prove it works in a live game.

Link to the original documentation when it helps. Don’t include game assets, saves, credentials, or logs containing personal information.

## Before opening the PR

Make sure the check passes, links work, and code examples still copy correctly. Mention anything you couldn’t verify. Leave generated builds, browser profiles and other local files out of the PR.
