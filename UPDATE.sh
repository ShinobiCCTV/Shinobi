#!/usr/bin/env bash

progname=$(basename $0)

tmpd=$(mktemp -d)
trap "rm -rf $tmpd" EXIT

set -e

err() {
  echo "$progname: ""$@" >&2
}

usage() {
  echo "usage: $progname: -b <git branch> -d </full/path/to/shinobi>"
  echo ""
  echo "-b   dev|master      the branch of Shinobi you want to use"
  echo "-d   /opt/Shinobi    the full path to your Shinobi checkout"
  echo "-h                   show help"
}

if [[ $# -eq 0 ]]; then
  usage >&2
  exit 99
fi

while getopts hd:b: opt; do
  case $opt in
    b)
      case $OPTARG in
        dev|master)
          distro=$OPTARG
          ;;
        *)
          err "branch must be dev or master"
          exit 1
          ;;
      esac
      ;;
    d)
      if [[ ! -w $OPTARG ]]; then
        err "$OPTARG is not writable"
        exit 2
      fi
      shinobi=$OPTARG
      ;;
    h)
      usage
      exit 0
      ;;
    *)
      usage
      exit 10
      ;;
  esac
done
shift $((OPTIND-1))

if [[ -z $distro ]]; then
  err "-b <branch> is required"
  usage >&2
  exit 99
fi

if [[ -z $shinobi ]]; then
  err "-d </full/path/to/shinobi/checkout> is required"
  usage >&2
  exit 99
fi

# download  source
wget -O $tmpd/$distro https://github.com/ShinobiCCTV/Shinobi/tarball/$distro

# stop existing processes
cd $shinobi
pm2 stop camera.js
pm2 stop cron.js
pm2 kill

# unpack new files to shinobi directory
tar -xzf $tmpd/$distro --strip-components=1

# update nodejs modules and start shinobi processes
npm install
pm2 start camera.js
pm2 start cron.js
if [[ -f plugins/motion/conf.json ]]; then
  pm2 start plugins/motion/shinobi-motion.js
fi

exit 0
