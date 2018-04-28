# OpenCV CUDA
apt install git -y
if [ ! -e "./opencv" ]; then
    git clone https://github.com/opencv/opencv.git
    cd opencv
    git checkout 3.4.0
    cd ..
fi
if [ ! -e "./opencv_contrib" ]; then
    git clone https://github.com/opencv/opencv_contrib.git
    cd opencv_contrib
    git checkout 3.4.0
    cd ..
fi
cd opencv
if [ ! -e "./build" ]; then
    mkdir build
fi
cd build
if [ $(dpkg-query -W -f='${Status}' libxvidcore-dev 2>/dev/null | grep -c "ok installed") -eq 0 ]; then
    sudo apt-get install libjpeg-dev libpango1.0-dev libgif-dev build-essential -y
    sudo apt-get install libxvidcore-dev libx264-dev -y
    sudo apt-get install libatlas-base-dev gfortran -y

    sudo apt install build-essential cmake pkg-config unzip ffmpeg qtbase5-dev python-dev python3-dev python-numpy python3-numpy libhdf5-dev libgtk-3-dev libdc1394-22 libdc1394-22-dev libjpeg-dev libtiff5-dev libtesseract-dev -y
#
#    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu zesty-security main"
#    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main"
#    sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu artful-security main"
    sudo apt update
    sudo apt install libjasper1 libjasper-dev libavcodec-dev libavformat-dev libswscale-dev libxine2-dev libgstreamer-plugins-base1.0-0 libgstreamer-plugins-base1.0-dev libpng16-16 libpng-dev libv4l-dev libtbb-dev libfaac-dev libmp3lame-dev libopencore-amrnb-dev libopencore-amrwb-dev libtheora-dev libvorbis-dev libxvidcore-dev v4l-utils -y
fi
export LD_LIBRARY_PATH=/usr/local/cuda/lib
export PATH=$PATH:/usr/local/cuda/bin

cmake -D CMAKE_INSTALL_PREFIX=/usr/local -D WITH_NVCUVID=ON -D FORCE_VTK=ON -D BUILD_DOCS=ON -D WITH_XINE=ON -D WITH_CUDA=ON -D WITH_OPENGL=ON -D WITH_TBB=ON -D BUILD_EXAMPLES=ON -D WITH_OPENCL=ON -D CMAKE_BUILD_TYPE=RELEASE -D CUDA_NVCC_FLAGS="-D_FORCE_INLINES --expt-relaxed-constexpr" -D WITH_GDAL=ON -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules/ -D ENABLE_FAST_MATH=1 -D CUDA_FAST_MATH=1 -D WITH_CUBLAS=1 ..

make -j $(nproc)
sudo make install
sudo /bin/bash -c 'echo "/usr/local/lib" > /etc/ld.so.conf.d/opencv.conf'
sudo ldconfig
sudo apt-get update