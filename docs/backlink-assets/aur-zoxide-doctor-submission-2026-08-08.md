# AUR submission checklist — zoxide-doctor

## What is ready

- Package name: `zoxide-doctor`
- Package URL field: `https://zoxide.org/tools/zoxide-doctor/`
- Description: `Independent CLI that diagnoses zoxide installation, PATH, and shell setup`
- Package assets: https://github.com/jiankn/zoxide-doctor/tree/main/packaging/aur
- Verified Arch build: https://github.com/jiankn/zoxide-doctor/actions/runs/31249947263

The AUR package page will describe a genuinely installable diagnostic CLI and
link to the matching tool guide. It must not be presented as the upstream
zoxide project.

## Browser-only account setup

1. Register or sign in at https://aur.archlinux.org/.
2. Generate a dedicated SSH key locally. Do not reuse a personal key.

   ```powershell
   ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\aur_zoxide_doctor" -C "aur-zoxide-doctor"
   Get-Content "$env:USERPROFILE\.ssh\aur_zoxide_doctor.pub"
   ```

3. In **My Account**, paste only the resulting `.pub` value into the SSH public
   key field. Never paste the private-key file anywhere.

## Copy-paste submission commands

Run these commands in an Arch Linux environment after the SSH public key is
accepted. Replace the maintainer comment before committing with a contact
address you are willing to make public.

```sh
git -c init.defaultBranch=master clone ssh://aur@aur.archlinux.org/zoxide-doctor.git
cd zoxide-doctor
curl -LO https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/packaging/aur/PKGBUILD
curl -LO https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/packaging/aur/.SRCINFO
curl -LO https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/packaging/aur/LICENSE
```

Before pushing, edit the first line of `PKGBUILD`, then run:

```sh
makepkg -sfc
makepkg --printsrcinfo > .SRCINFO
git add PKGBUILD .SRCINFO LICENSE
git commit -m 'Initial AUR package for zoxide-doctor'
git push origin master
```

## After the push

The expected public page is:

`https://aur.archlinux.org/packages/zoxide-doctor`

Do not count it as a live backlink until the page returns HTTP 200 and its
project URL renders as `https://zoxide.org/tools/zoxide-doctor/` without a
blocking `rel` token.
