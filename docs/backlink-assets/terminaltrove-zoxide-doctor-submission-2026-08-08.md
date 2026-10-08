# Terminal Trove submission packet - zoxide-doctor

Status: **Preview asset ready; owner submission still requires a logged-in Terminal Trove browser session.**

## Fields

- Submission page: https://terminaltrove.com/submit/
- Name: `zoxide-doctor`
- Short description: `Read-only CLI for diagnosing zoxide PATH and shell initialization across Linux, macOS, and Windows.`
- Install command: `npm install -g zoxide-doctor`
- Run command: `zoxide-doctor --shell bash --json`
- Website: https://zoxide.org/tools/zoxide-doctor/
- Source repository: https://github.com/jiankn/zoxide-doctor
- Preview image: https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/docs/assets/zoxide-doctor-terminal-preview.png
- Category: Developer tools / CLI
- License: MIT

## Preview provenance

The PNG was generated from the real `zoxide-doctor@0.1.0` tarball using:

```bash
zoxide-doctor --shell bash --json
```

It shows the read-only diagnostic output, including the PATH failure, optional
fzf notice, and the zoxide.org troubleshooting destinations. The source SVG
is retained beside the PNG in the `jiankn/zoxide-doctor` repository.

## Owner action

Open the submission page in a logged-in browser, pass any Cloudflare check,
paste the fields above, and upload or reference the PNG if the form requires a
file upload. Do not create a duplicate listing if the site reports that
`zoxide-doctor` already exists.

After submission, the expected public page is:

`https://terminaltrove.com/zoxide-doctor/`

Do not count the listing until that page returns HTTP 2xx, has no page-level
`noindex`, renders the website link, and its link attributes have been audited.
