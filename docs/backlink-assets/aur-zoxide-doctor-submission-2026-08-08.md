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

## Fastest submission from Windows PowerShell

The committed Arch CI already ran `makepkg`, checked `.SRCINFO`, installed the
package, and ran `zoxide-doctor --help`. You do not need to install Arch Linux
just to push the verified package files.

After the SSH public key is accepted, configure the dedicated private key for
the AUR host. Replace the placeholder path with the private key that was
generated in the previous step.

```powershell
@"
Host aur.archlinux.org
  User aur
  IdentityFile C:\Users\YOUR_WINDOWS_USER\.ssh\aur_zoxide_doctor
  IdentitiesOnly yes
"@ | Add-Content "$env:USERPROFILE\.ssh\config"
```

Then run the following. Before committing, edit only the first line of
`PKGBUILD` and use a contact address you are willing to publish.

```powershell
git -c init.defaultBranch=master clone ssh://aur@aur.archlinux.org/zoxide-doctor.git
Set-Location zoxide-doctor
curl.exe -LO https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/packaging/aur/PKGBUILD
curl.exe -LO https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/packaging/aur/.SRCINFO
curl.exe -LO https://raw.githubusercontent.com/jiankn/zoxide-doctor/main/packaging/aur/LICENSE
notepad PKGBUILD
git add PKGBUILD .SRCINFO LICENSE
git commit -m 'Initial AUR package for zoxide-doctor'
git push origin master
```

If you prefer to repeat the build locally, run `makepkg -sfc` and
`makepkg --printsrcinfo > .SRCINFO` in an Arch Linux environment before the
Git commit.

## After the push

The expected public page is:

`https://aur.archlinux.org/packages/zoxide-doctor`

Do not count it as a live backlink until the page returns HTTP 200 and its
project URL renders as `https://zoxide.org/tools/zoxide-doctor/` without a
blocking `rel` token.
