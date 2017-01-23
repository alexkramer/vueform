#!/bin/sh
# Modified from the Apex install script:
# https://github.com/apex/apex/blob/master/install.sh

install () {

  set -eu

  UNAME=$(uname)
  if [ "$UNAME" != "Linux" -a "$UNAME" != "Darwin" ] ; then
    echo "Sorry, OS not supported: ${UNAME}."
    echo "Download binary from https://github.com/mholt/caddy/releases."
    exit 1
  fi

  if [ "$UNAME" = "Darwin" ] ; then
    OSX_ARCH=$(uname -m)
    if [ "${OSX_ARCH}" = "x86_64" ] ; then
      PLATFORM="darwin_amd64"
      EXT=zip
    else
      echo "Sorry, OS not supported: ${UNAME}."
      echo "Download binary from https://github.com/mholt/caddy/releases."
      exit 1
    fi
  elif [ "$UNAME" = "Linux" ] ; then
    LINUX_ARCH=$(uname -m)
    if [ "${LINUX_ARCH}" = "x86_64" ] ; then
      PLATFORM="linux_amd64"
      EXT=tar.gz
    else
      echo "Sorry, OS not supported: ${UNAME}."
      echo "Download binary from https://github.com/mholt/caddy/releases."
      exit 1
    fi
  fi

  LATEST=$(curl -s https://api.github.com/repos/mholt/caddy/tags | grep -Eo '"name":.*?[^\\]",'  | head -n 1 | sed 's/[," ]//g' | cut -d ':' -f 2)
  URL="https://github.com/mholt/caddy/releases/download/$LATEST/caddy_$PLATFORM.$EXT"
  TMP_PATH="/tmp/caddy_$PLATFORM.$EXT"
  DEST=/usr/local/bin/caddy

  if [ -z $LATEST ] ; then
    echo "Error requesting."
    echo "Download binary from https://github.com/mholt/caddy/releases."
    exit 1
  else
    curl -sL https://github.com/mholt/caddy/releases/download/$LATEST/caddy_$PLATFORM.$EXT -o $TMP_PATH
    if [ "$EXT" = "zip" ]; then
      unzip $TMP_PATH -d "/tmp/caddy_$PLATFORM"
    else
      mkdir "/tmp/caddy_$PLATFORM"
      tar -xvzf $TMP_PATH -C "/tmp/caddy_$PLATFORM"
    fi
    mv "/tmp/caddy_$PLATFORM/caddy_$PLATFORM" $DEST
    chmod +x $DEST
  fi

}

install
