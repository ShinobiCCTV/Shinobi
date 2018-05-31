#!/bin/bash
# OpenCV CUDA
if [ $(dpkg-query -W -f='${Status}' git 2>/dev/null | grep -c "ok installed") -eq 0 ]; then
    echo "Installing Git..."
    apt install git -y;
fi

if [ ! -e "./opencv" ]; then
    echo "Downloading OpenCV..."
    git clone https://github.com/opencv/opencv.git
    cd opencv
    git checkout 3.4.0
    cd ..
fi
if [ ! -e "./opencv_contrib" ]; then
    echo "Downloading OpenCV Modules..."
    git clone https://github.com/opencv/opencv_contrib.git
    cd opencv_contrib
    git checkout 3.4.0
    cd ..
fi
echo "Opening OpenCV Directory..."
cd opencv
if [ ! -e "./build" ]; then
    echo "Creating OpenCV Build Directory..."
    mkdir build
fi
echo "Entering OpenCV Build Directory..."
cd build
echo "*****************"
flavor=$(cat /var/log/installer/media-info)
echo "$flavor"
echo "*****************"
echo "Adding Additional Repository"
echo "http://security.ubuntu.com/ubuntu"
if [ "$flavor" = *"Artful"* ]; then
    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu artful-security main"
fi
if [ "$flavor" = *"Zesty"* ]; then
    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu zesty-security main"
fi
if [ "$flavor" = *"Xenial"* ]; then
    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main"
fi
if [ "$flavor" = *"Trusty"* ]; then
    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu trusty-security main"
fi
echo "Downloading Libraries"
sudo apt-get install libjpeg-dev libpango1.0-dev libgif-dev build-essential gcc-6 g++-6 -y;
sudo apt-get install libxvidcore-dev libx264-dev -y;
sudo apt-get install libatlas-base-dev gfortran -y;

sudo apt install build-essential cmake pkg-config unzip ffmpeg qtbase5-dev python-dev python3-dev python-numpy python3-numpy libhdf5-dev libgtk-3-dev libdc1394-22 libdc1394-22-dev libjpeg-dev libtiff5-dev libtesseract-dev -y;

sudo apt install libavcodec-dev libavformat-dev libswscale-dev libxine2-dev libgstreamer-plugins-base1.0-0 libgstreamer-plugins-base1.0-dev libpng16-16 libpng-dev libv4l-dev libtbb-dev libmp3lame-dev libopencore-amrnb-dev libopencore-amrwb-dev libtheora-dev libvorbis-dev libxvidcore-dev v4l-utils libleptonica-dev -y

echo "Setting CUDA Paths"
export LD_LIBRARY_PATH=/usr/local/cuda/lib
export PATH=$PATH:/usr/local/cuda/bin
echo "Configure OpenCV Build"

cmake -D CMAKE_INSTALL_PREFIX=/usr/local -D WITH_NVCUVID=ON -D FORCE_VTK=ON -D WITH_XINE=ON -D WITH_CUDA=ON -D WITH_OPENGL=ON -D WITH_TBB=ON -D WITH_OPENCL=ON -D CMAKE_BUILD_TYPE=RELEASE -D CUDA_NVCC_FLAGS="-D_FORCE_INLINES --expt-relaxed-constexpr" -D WITH_GDAL=ON -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules/ -D ENABLE_FAST_MATH=1 -D CUDA_FAST_MATH=1 -D WITH_CUBLAS=1 -D CXXFLAGS="-std=c++11" -DCMAKE_CXX_COMPILER=g++-6 -DCMAKE_C_COMPILER=gcc-6 ..

echo "Start OpenCV Build"
make -j "$(nproc)"
echo "Install OpenCV Build"
sudo make install
sudo /bin/bash -c 'echo "/usr/local/lib" > /etc/ld.so.conf.d/opencv.conf'
sudo ldconfig
sudo apt-get update
echo "============="
echo "Done installing OpenCV!"
echo "============="
echo "Delete OpenCV source files? This will save a lot of space but it will be more tedious to uninstall OpenCV later."
echo "(y)es or (N)o"
read opencvuninstall
if [ "$opencvuninstall" = "y" ] || [ "$opencvuninstall" = "Y" ]; then
    rm -rf opencv
    rm -rf opencv_contrib
fi