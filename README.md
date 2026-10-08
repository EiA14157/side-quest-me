# Side Quest Me

Private source snapshot for https://side-quest-me.knightatha.chatgpt.site (Sites v1), verified on 2026-10-08. Original deployment source commit: `0a921932762f2c5ab87a090b445798fb2d380d92`. The GitHub repository begins with a new snapshot commit and contains no prior private Git history.

## Run

Serve the `dist/` directory with a static HTTP server, for example:

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8080/. The production files are plain HTML, CSS and JavaScript; no build is required.

## Checks

Use Node.js 22.22.2 or Node.js 24.15+ and run `npm ci`, `npm test`, and `npm run test:dom`. The DOM/native-canvas harness is not a real-browser layout test. Generated test images and results stay in ignored `qa-output/`.

## Hosting and source

The Sites manifest preserves the public project identifier and static directory. This backup does not change the running site or its settings.

Runtime files in `dist/` are copied byte-for-byte from the deployment source commit. See `source-snapshot.json` for original file hashes. Development imports, dependency manifests and this documentation are normalized for a standalone checkout.

## Assets and exclusions

See `ASSET-NOTES.md`. Existing Git metadata, credentials, environment files, node_modules, caches, browser profiles, downloads, archives, deployment tokens, personal logs and QA screenshots/results are excluded. No essential production file was excluded. No open-source code license has been assigned. Keep this repository private; future publication requires a separate authorized decision.
