# 卸载实测：安装 → 用一次（生成数据库）→ 卸载 → 检查程序、数据库、残留初始化行的报错。
# 用法：python3 uninstall_evidence.py <macos-brew|ubuntu-script|ubuntu-apt|cargo|windows-scoop> <输出 JSON>
# 每条命令都记录退出码和原始输出；Windows 下命令交给 pwsh -NoProfile 执行。
import datetime, json, os, pathlib, platform, subprocess, sys

method, output = sys.argv[1:3]
home = pathlib.Path.home()
records = []
is_windows = method.startswith('windows')


def run(command, label=None, env=None):
    if is_windows:
        args = ['pwsh', '-NoLogo', '-NoProfile', '-Command', command]
    else:
        args = ['bash', '-c', command]
    full_env = {**os.environ, **(env or {})}
    r = subprocess.run(args, capture_output=True, text=True, timeout=900, env=full_env)
    row = dict(label=label or command, command=command, exit=r.returncode,
               stdout=r.stdout[-4000:], stderr=r.stderr[-4000:])
    records.append(row)
    print(json.dumps(row, ensure_ascii=False))
    return row


def must(row, exit=0):
    assert row['exit'] == exit, row
    return row


if method == 'macos-brew':
    run('sw_vers; uname -m; brew --version')
    must(run('brew install zoxide', label='install: brew install zoxide'))
    run('brew list zoxide', label='files installed by Homebrew')
    must(run('zoxide add /tmp && zoxide add /usr', label='use once: zoxide add'))
    db = home / 'Library/Application Support/zoxide/db.zo'
    run(f'ls -l "{db}"', label='database location before uninstall')
    rc = home / '.zshrc'
    rc.write_text('eval "$(zoxide init zsh)"\n')
    must(run('brew uninstall zoxide', label='uninstall: brew uninstall zoxide'))
    must(run('command -v zoxide', label='after uninstall: command -v zoxide'), exit=1)
    run(f'ls -l "{db}"', label='after uninstall: database still there?')
    run("zsh -i -c 'true'", label='after uninstall, init line still in ~/.zshrc: open a new zsh')
    rc.write_text('')
    run("zsh -i -c 'true'", label='after removing the init line: open a new zsh')
    must(run(f'rm -rf "{db.parent}" && test ! -e "{db.parent}"', label='delete the database folder'))

elif method == 'ubuntu-script':
    run('cat /etc/os-release | head -2; id -un')
    must(run('curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh',
             label='install: official install script'))
    run('find ~/.local -path "*zoxide*" -type f | sort', label='files installed by the script')
    must(run('~/.local/bin/zoxide add /tmp && ~/.local/bin/zoxide add /usr', label='use once: zoxide add'))
    db = home / '.local/share/zoxide/db.zo'
    run(f'ls -l "{db}"', label='database location before uninstall')
    rc = home / '.bashrc'
    original = rc.read_text() if rc.exists() else ''
    rc.write_text(original + '\neval "$(zoxide init bash)"\n')
    must(run('rm ~/.local/bin/zoxide ~/.local/share/man/man1/zoxide*.1',
             label='uninstall: delete the binary and man pages'))
    must(run("bash -lc 'command -v zoxide'", label='after uninstall: command -v zoxide (login shell)'), exit=1)
    run('find ~/.local -path "*zoxide*" | sort', label='after uninstall: what is left under ~/.local')
    run("bash -i -c 'true'", label='after uninstall, init line still in ~/.bashrc: open a new bash')
    rc.write_text(original)
    run("bash -i -c 'true'", label='after removing the init line: open a new bash')
    must(run(f'rm -rf "{db.parent}" && test ! -e "{db.parent}"', label='delete the database folder'))

elif method == 'ubuntu-apt':
    run('cat /etc/os-release | head -2')
    must(run('apt-get install -y -qq zoxide > /dev/null && zoxide --version', label='install: apt install zoxide'))
    run('dpkg -L zoxide | grep -v "/$" | sort', label='files installed by the package')
    must(run('zoxide add /tmp && zoxide add /usr', label='use once: zoxide add'))
    must(run('apt-get remove -y zoxide 2>&1 | tail -n 4', label='uninstall: apt remove zoxide'))
    must(run('command -v zoxide', label='after uninstall: command -v zoxide'), exit=1)
    run('dpkg -l zoxide | tail -n 1', label='after uninstall: package state')
    run(f'ls -l "{home}/.local/share/zoxide/db.zo"', label='after uninstall: database still there?')

elif method == 'cargo':
    run('cargo --version')
    must(run('cargo install zoxide --locked 2>&1 | tail -n 3', label='install: cargo install zoxide --locked'))
    run('ls -l ~/.cargo/bin/zoxide', label='file installed by Cargo')
    must(run('cargo uninstall zoxide 2>&1', label='uninstall: cargo uninstall zoxide'))
    run('ls ~/.cargo/bin/zoxide', label='after uninstall: ~/.cargo/bin/zoxide')

elif method == 'windows-scoop':
    run('[System.Environment]::OSVersion.VersionString; $PSVersionTable.PSVersion.ToString()')
    must(run("irm get.scoop.sh -outfile $env:TEMP\\install-scoop.ps1; & $env:TEMP\\install-scoop.ps1 -RunAsAdmin | Select-Object -Last 2",
             label='prerequisite: install Scoop'))
    scoop_env = '$env:Path = "$env:USERPROFILE\\scoop\\shims;$env:Path"; '
    must(run(scoop_env + 'scoop install zoxide | Select-Object -Last 3', label='install: scoop install zoxide'))
    must(run(scoop_env + 'zoxide --version; (Get-Command zoxide).Source; zoxide add $env:TEMP; zoxide add $env:SystemRoot',
             label='use once: version, location, zoxide add'))
    run('Get-Item "$env:LOCALAPPDATA\\zoxide\\db.zo" | Select-Object FullName, Length | Format-List',
        label='database location before uninstall')
    profile = pathlib.Path(os.environ['TEMP']) / 'zo-profile.ps1'
    profile.write_text('Invoke-Expression (& { (zoxide init powershell | Out-String) })\n')
    must(run(scoop_env + 'scoop uninstall zoxide', label='uninstall: scoop uninstall zoxide'))
    run(scoop_env + 'Get-Command zoxide -ErrorAction SilentlyContinue; "found=" + [bool](Get-Command zoxide -ErrorAction SilentlyContinue)',
        label='after uninstall: Get-Command zoxide')
    run('Test-Path "$env:LOCALAPPDATA\\zoxide\\db.zo"', label='after uninstall: database still there?')
    run(f". '{profile}'", label='after uninstall, init line still in the profile: load the profile')
    run('Remove-Item -Recurse -Force "$env:LOCALAPPDATA\\zoxide"; Test-Path "$env:LOCALAPPDATA\\zoxide"',
        label='delete the database folder')
else:
    raise SystemExit('unknown method ' + method)

report = dict(method=method, executed_at_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
              runner=dict(image_os=os.environ.get('ImageOS'), image_version=os.environ.get('ImageVersion'),
                          run_id=os.environ.get('GITHUB_RUN_ID'), commit=os.environ.get('GITHUB_SHA'),
                          python_platform=platform.platform()),
              commands=records)
pathlib.Path(output).write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
