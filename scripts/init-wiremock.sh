#!/bin/sh
set -e
export MSYS_NO_PATHCONV=1
ROOT="$(pwd -W 2>/dev/null || pwd)"

STATE_EXT_VERSION=0.10.1
STATE_EXT_JAR=".wiremock/extensions/wiremock-state-extension-standalone-$STATE_EXT_VERSION.jar"
if [ ! -f "$STATE_EXT_JAR" ]; then
  mkdir -p .wiremock/extensions
  curl -fsSL -o "$STATE_EXT_JAR" \
    "https://repo1.maven.org/maven2/org/wiremock/extensions/wiremock-state-extension-standalone/$STATE_EXT_VERSION/wiremock-state-extension-standalone-$STATE_EXT_VERSION.jar"
fi

docker run -it --rm -p 8080:8080 --name ecommerce-wiremock \
  -e WIREMOCK_STATE_EXTENSION_CONTEXT_EXPIRATION_SEC=86400 \
  -v "$ROOT/.wiremock:/home/wiremock" \
  -v "$ROOT/.wiremock/extensions:/var/wiremock/extensions" \
  wiremock/wiremock:latest --global-response-templating --enable-stub-cors
