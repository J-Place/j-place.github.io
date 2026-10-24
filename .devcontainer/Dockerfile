# Dev container for working on the USMS repos (swim-tools, eleventy, sergey)
# with Claude Code in auto mode: a separate small computer that can only
# reach the repo it's opened for (swim-tools' also sees Eleventy beside it),
# never Eleventy's production/ checkout, and a short list of sites.
# How to use it: swim-tools/docs/dev-container.md. The same file is in each
# USMS repo's .devcontainer/; keep the copies identical (each repo's
# devcontainer.json says what it mounts).
#
# Adapted from Anthropic's reference (github.com/anthropics/claude-code,
# .devcontainer/), tightened: Node 22 to match the production image, no
# GitHub and no SSH in the firewall (pushing happens from the Mac), and
# Playwright's Chromium for checking pages in a browser.
FROM node:22-bookworm

ARG TZ
ENV TZ="$TZ"

RUN apt-get update && apt-get install -y --no-install-recommends \
  less git procps sudo nano jq curl ca-certificates \
  iptables ipset iproute2 dnsutils \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Global npm packages and Playwright's browsers live where the node user can
# write, outside the repo.
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/ms-playwright
RUN mkdir -p /usr/local/share/npm-global /usr/local/share/ms-playwright && chown -R node:node /usr/local/share

# Chromium's system libraries (needs root). Downloads happen here, while the
# image is built; the firewall blocks them once the container runs.
ARG PLAYWRIGHT_VERSION=1.62.1
RUN npx -y playwright@${PLAYWRIGHT_VERSION} install-deps chromium && rm -rf /root/.npm

# Mount points, owned by the node user so the volumes mounted over them are
# too: node_modules (Linux builds, kept apart from the Mac's), the cover over
# Eleventy's production/, Claude Code's settings and the shell history.
RUN mkdir -p /usms/swim-tools/node_modules /usms/eleventy/node_modules /usms/eleventy/production \
  /usms/eleventy/src/data/top-times-generated /usms/sergey/node_modules /home/node/.claude /commandhistory \
  && chown -R node:node /usms /home/node/.claude /commandhistory

ENV DEVCONTAINER=true
ENV EDITOR=nano
WORKDIR /usms

USER node
ARG CLAUDE_CODE_VERSION=latest
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} playwright@${PLAYWRIGHT_VERSION} \
  && playwright install chromium \
  && echo 'export HISTFILE=/commandhistory/.bash_history PROMPT_COMMAND="history -a"' >> /home/node/.bashrc

# The firewall: the node user may run this one script as root, nothing else.
USER root
COPY init-firewall.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init-firewall.sh \
  && echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall \
  && chmod 0440 /etc/sudoers.d/node-firewall
USER node
