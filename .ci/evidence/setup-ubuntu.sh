#!/usr/bin/env bash
# 官方 ubuntu:24.04 容器：root 装测试工具，普通用户 dev 跑官方安装脚本
set -euo pipefail
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq curl ca-certificates zsh tmux python3 > /dev/null
useradd -m -s /bin/bash dev
su - dev -c 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh' > /work/evidence/ubuntu-install.log 2>&1
su - dev -c 'python3 /work/.ci/evidence/shell-runtime.py ubuntu /tmp/ubuntu-results.json'
cp /tmp/ubuntu-results.json /work/evidence/
