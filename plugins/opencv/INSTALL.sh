#!/bin/bash
echo "Shinobi - Do ypu want to let the `opencv4nodejs` npm package install OpenCV? Only do this if you will not use a GPU (Hardware Acceleration)."
echo "(y)es or (N)o"
read nodejsinstall
if [ "$nodejsinstall" = "y" ] || [ "$nodejsinstall" = "Y" ]; then
    export OPENCV4NODEJS_DISABLE_AUTOBUILD=1
fi
npm install opencv4nodejs moment express canvas@1.6 --unsafe-perm