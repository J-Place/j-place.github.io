#!/bin/bash
# The dev container's firewall, run as root each time the container starts
# (devcontainer.json postStartCommand). Default deny: the container may reach
# only the sites below, then this checks that it worked.
#
# Adapted from Anthropic's reference init-firewall.sh, tightened: no GitHub
# and no outbound SSH, so nothing can be pushed from inside (push from the
# Mac). Every package these repos install comes from registry.npmjs.org.
#
# Sites are resolved to addresses once, at start. If npm fails later because
# a site moved, rerun: sudo /usr/local/bin/init-firewall.sh
set -euo pipefail
IFS=$'\n\t'

ALLOWED=(
  registry.npmjs.org             # npm install
  api.anthropic.com              # Claude Code
  console.anthropic.com          # Claude Code sign-in
  claude.ai                      # Claude Code sign-in
  statsig.com                    # Claude Code
  sentry.io                      # Claude Code error reports
  marketplace.visualstudio.com   # VS Code extensions
  vscode.blob.core.windows.net   # VS Code extensions
  update.code.visualstudio.com   # VS Code server
)

# Keep Docker's own DNS working
DOCKER_DNS_RULES=$(iptables-save -t nat | grep "127\.0\.0\.11" || true)
iptables -F; iptables -X
iptables -t nat -F; iptables -t nat -X
iptables -t mangle -F; iptables -t mangle -X
ipset destroy allowed-domains 2>/dev/null || true
if [ -n "$DOCKER_DNS_RULES" ]; then
  iptables -t nat -N DOCKER_OUTPUT 2>/dev/null || true
  iptables -t nat -N DOCKER_POSTROUTING 2>/dev/null || true
  echo "$DOCKER_DNS_RULES" | xargs -L 1 iptables -t nat
fi

# DNS and the container's own loopback
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

ipset create allowed-domains hash:net
for domain in "${ALLOWED[@]}"; do
  ips=$(dig +noall +answer A "$domain" | awk '$4 == "A" {print $5}')
  if [ -z "$ips" ]; then
    echo "ERROR: couldn't resolve $domain" >&2
    exit 1
  fi
  while read -r ip; do
    [[ "$ip" =~ ^[0-9]{1,3}(\.[0-9]{1,3}){3}$ ]] || { echo "ERROR: bad address for $domain: $ip" >&2; exit 1; }
    ipset add -exist allowed-domains "$ip"
  done <<< "$ips"
done

# Docker's network between the container and the Mac (VS Code, forwarded ports)
HOST_IP=$(ip route | awk '/default/ {print $3; exit}')
[ -n "$HOST_IP" ] || { echo "ERROR: couldn't find the host network" >&2; exit 1; }
HOST_NETWORK="${HOST_IP%.*}.0/24"
iptables -A INPUT -s "$HOST_NETWORK" -j ACCEPT
iptables -A OUTPUT -d "$HOST_NETWORK" -j ACCEPT

iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT
iptables -A OUTPUT -j REJECT --reject-with icmp-admin-prohibited

# Check: the open web and GitHub are blocked, npm is reachable
fail=0
for blocked in https://example.com https://github.com; do
  if curl -s --connect-timeout 5 -o /dev/null "$blocked"; then echo "ERROR: $blocked is reachable" >&2; fail=1; fi
done
if ! curl -s --connect-timeout 5 -o /dev/null https://registry.npmjs.org/; then echo "ERROR: registry.npmjs.org is blocked" >&2; fail=1; fi
[ "$fail" = 0 ] && echo "Firewall on: only ${#ALLOWED[@]} sites reachable; example.com and github.com blocked."
exit "$fail"
