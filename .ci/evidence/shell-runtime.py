# 安装实测（macOS / Ubuntu）：用 tmux 驱动真实交互式登录 shell，
# 每条命令后都回到提示符，数据库从另一个进程查询。输出 JSON 原始记录。
# 用法：python3 shell-runtime.py <macos|ubuntu> <输出文件>，以普通用户身份运行。
import datetime, json, os, pathlib, re, shlex, subprocess, sys, time

platform, output = sys.argv[1:3]
assert platform in ('macos', 'ubuntu'), platform
home = os.path.expanduser('~')
records = []


def run(command, label=None):
    result = subprocess.run(['bash', '-c', command], capture_output=True, text=True, timeout=60)
    row = dict(label=label or command, command=command, exit=result.returncode,
               stdout=result.stdout, stderr=result.stderr)
    records.append(row)
    return row


def must(row, text=None, exit=0):
    assert row['exit'] == exit, row
    if text is not None:
        assert text in row['stdout'], row
    return row


if platform == 'macos':
    env_cmds = ['sw_vers', 'uname -m', 'brew --version', 'brew list --versions zoxide',
                'command -v zoxide', 'zoxide --version', '/bin/zsh --version', '/bin/bash --version']
    shells = [('macos-zsh', '/bin/zsh'), ('macos-bash', '/bin/bash')]
else:
    # Ubuntu 默认 ~/.profile 在登录时把已存在的 ~/.local/bin 加进 PATH
    env_cmds = ['id', 'cat /etc/os-release', 'uname -m', "bash -lc 'echo $PATH'", "bash -lc 'command -v zoxide'",
                "bash -lc 'zoxide --version'", 'bash --version', 'zsh --version']
    shells = [('ubuntu-bash', 'bash'), ('ubuntu-zsh', 'zsh')]
for cmd in env_cmds + ['tmux -V', 'command -v fzf']:
    run(cmd)
must(run('mkdir -p ~/work/api ~/work/api-docs ~/work/client-portal'))


class Terminal:
    def __init__(self, name, shell):
        self.name = name
        self.socket = 'evidence-' + name
        self.directory = home + '/.local/share/evidence-' + name
        self.count = 0
        must(run('mkdir -p ' + shlex.quote(self.directory)))
        command = 'env _ZO_DATA_DIR=' + shlex.quote(self.directory) + ' ' + shell + ' -il'
        must(run('tmux -L ' + self.socket + ' new-session -d -s test -x 120 -y 35 ' + shlex.quote(command)))
        time.sleep(1)

    def tmux(self, args):
        result = subprocess.run(['bash', '-c', 'tmux -L ' + self.socket + ' ' + args],
                                capture_output=True, text=True, timeout=20)
        assert result.returncode == 0, result.stderr
        return result.stdout

    def step(self, command, expected=None, exit=0):
        self.count += 1
        stem = self.directory + '/step-' + str(self.count)
        marker = '__EVIDENCE_' + self.name.replace('-', '_') + '_' + str(self.count)
        wrapped = '{ ' + command + '; } >' + shlex.quote(stem + '.out') + ' 2>' + shlex.quote(stem + '.err')
        wrapped += '; __evidence_status=$?; printf "' + marker + ':%s\\n" "$__evidence_status"'
        self.tmux('send-keys -t test -l ' + shlex.quote(wrapped))
        self.tmux('send-keys -t test Enter')
        deadline = time.monotonic() + 20
        status = None
        captured = ''
        while time.monotonic() < deadline:
            captured = self.tmux('capture-pane -p -t test -S -100')
            match = re.search(r'^' + re.escape(marker) + r':(\d+)\s*$', captured, re.M)
            if match:
                status = int(match.group(1))
                time.sleep(0.3)  # 等提示符钩子写完数据库
                break
            time.sleep(0.1)
        assert status is not None, (command, captured)
        row = dict(label=self.name + ': ' + command, command=command, exit=status,
                   stdout=pathlib.Path(stem + '.out').read_text(),
                   stderr=pathlib.Path(stem + '.err').read_text(),
                   method='interactive ' + self.name + ' login shell in tmux; separate prompt after each command',
                   data_directory=self.directory)
        records.append(row)
        return must(row, expected, exit)

    def query(self):
        row = must(run('env _ZO_DATA_DIR=' + shlex.quote(self.directory) + ' zoxide query --list --score',
                       label=self.name + ': query from outside terminal'))
        row['data_directory'] = self.directory
        return row

    def stop(self):
        self.tmux('kill-server')


# Ubuntu 上 zsh 不读 ~/.profile，教程让 zsh 用户自己把 ~/.local/bin 加进 PATH
zsh_path = 'export PATH="$HOME/.local/bin:$PATH"\n' if platform == 'ubuntu' else ''


def write_rc(filename, content, append=False):
    path = pathlib.Path(home + '/' + filename)
    label = ('append to ~/' if append else 'write ~/') + filename
    records.append(dict(label=label, command='(file edited)', exit=0, stdout=content, stderr=''))
    if append and path.exists():
        content = path.read_text() + '\n' + content
    path.write_text(content)


# 初始化之前 z 不存在
must(run("bash --noprofile --norc -ic 'type -t z'"), exit=1)
write_rc('.zshrc', zsh_path + 'PS1="Z> "\neval "$(zoxide init zsh)"\n')
if platform == 'macos':
    write_rc('.bash_profile', 'PS1="B> "\nexport BASH_SILENCE_DEPRECATION_WARNING=1\neval "$(zoxide init bash)"\n')
else:
    # 保留 Ubuntu 默认 ~/.bashrc，只在末尾追加
    write_rc('.bashrc', 'PS1="B> "\neval "$(zoxide init bash)"\n', append=True)

scenarios = []
for name, shell in shells:
    t = Terminal(name, shell)
    t.step('type z')
    t.step('type zi')
    empty = t.query()['stdout']
    assert empty == '', empty
    t.step('cd ~/work/api && pwd', home + '/work/api')
    t.step('cd ~/work/api-docs && pwd', home + '/work/api-docs')
    t.step('cd ~/work/client-portal && pwd', home + '/work/client-portal')
    learned = t.query()['stdout']
    assert home + '/work/api' in learned, learned
    t.step('cd ~')
    jump = t.step('z api && pwd')
    t.step('z zz-no-such-keyword-923', exit=1)
    t.stop()
    scenarios.append(dict(name=name, shell=shell, initially_empty=empty, learned=learned,
                          jump=jump['stdout'], data_directory=t.directory))

# --cmd cd 方式（zsh）
write_rc('.zshrc', zsh_path + 'PS1="C> "\neval "$(zoxide init zsh --cmd cd)"\n')
t = Terminal(platform + '-zsh-cd', 'zsh')
t.step('whence -w cd', 'function')
t.step('whence -w cdi', 'function')
t.step('whence -w z', exit=1)
t.step('cd ~/work/client-portal && pwd', home + '/work/client-portal')
t.step('cd ~')
t.step('cd client && pwd', home + '/work/client-portal')
t.stop()
scenarios.append(dict(name=platform + '-zsh-cd', shell='zsh', navigation='cd', data_directory=t.directory))

install = ('Homebrew install on a GitHub-hosted macOS runner.' if platform == 'macos' else
           'Official install script run as a normal user in the official ubuntu:24.04 container on a GitHub-hosted runner.')
report = dict(platform=platform, executed_at_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
              method=install + ' Actual interactive login shells driven with tmux; query snapshots from a separate process.',
              runner=dict(image_os=os.environ.get('ImageOS'), image_version=os.environ.get('ImageVersion'),
                          run_id=os.environ.get('GITHUB_RUN_ID'), commit=os.environ.get('GITHUB_SHA')),
              scenarios=scenarios, commands=records)
pathlib.Path(output).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
