#!/bin/bash
echo "Shinobi Installer"
echo "========"
echo "Select your OS"
echo "If your OS is not on the list please refer to the docs."
echo "========"
echo "1. Ubuntu"
echo "2. CentOS"
echo "3. MacOS"
echo "4. FreeBSD"
echo "========"
read oschoicee
case $oschoicee in
"1")
chmod +x INSTALL/ubuntu.sh
sh INSTALL/ubuntu.sh
  ;;
"2")
chmod +x INSTALL/centos.sh
INSTALL/centos.sh
  ;;
"3")
chmod +x INSTALL/macos.sh
INSTALL/macos.sh
  ;;
"4")
chmod +x INSTALL/freebsd.sh
INSTALL/freebsd.sh
  ;;
*)
  echo "Choice not found."
  ;;
esac