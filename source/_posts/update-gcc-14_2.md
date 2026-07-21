---
title: "升级gcc 14.2.0"
date: 2024-10-15
categories:
  - "开发工具"
tags: 
  - "gcc"
---

## 编译 GMP，MPFR，MPC

注意三个库编译的顺序 (gmp -> mpfr -> mpc)。因为编译 mpfr 时需要依赖于 gmp，编译mpc时候又需要依赖于 gmp 和 mpfr，所以需要最先编译 gmp，然后编译 mpfr，最后编译 mpc。编译过程中需要在 configure 配置时设置好 gmp，mpfr 的 include 和 lib 路径，不然就会遇见 **_configure: error: libgmp not found or uses a different ABI (including static vs shared). configure: error: libmpfr not found or uses a different ABI (including static vs shared)._** 这两个 **_configure: error_**。

### 2.1. 编译GMP

编译的时候需要记录下 `--prefix` 参数的值，也就是我们自定义的gmp的安装目录，后面编译其他两个库和gcc的时候需要使用。

```bash
tar -xvjf gmp-6.2.1.tar.bz2
cd gmp-6.2.1/
./configure --prefix=$(pwd)
make
make install
```

### 2.2. 编译MPFR

```bash
tar -xvjf mpfr-4.1.0.tar.bz2
cd mpfr-4.1.0/
./configure --prefix=$(pwd) \
--with-gmp-include=/home/test/deps/gmp-6.2.1/include \
--with-gmp-lib=/home/test/deps/gmp-6.2.1/lib
make
make install
```

### 2.3. 编译MPC

```bash
tar -xvzf mpc-1.2.1.tar.gz
cd mpc-1.2.1/
./configure --prefix=$(pwd) \
--with-gmp-include=/home/test/deps/gmp-6.2.1/include \
--with-gmp-lib=/home/test/deps/gmp-6.2.1/lib \
--with-mpfr-include=/home/test/deps/mpfr-4.1.0/include \
--with-mpfr-lib=/home/test/deps/mpfr-4.1.0/lib
make
make install
```

### 2.4. 配置动态库 (so)到 LD\_LIBRARY\_PATH 环境变量

在终端运行下面命令可以将上面所编译好的三个库的动态库 (so)文件配置到 LD\_LIBRARY\_PATH 环境变量中，如果需要让配置永久生效，则需将下面的代码添加到 ~/.bashrc 文件中 并运行 `source ~/.bashrc` 命令即可。

```bash
export LD_LIBRARY_PATH=/home/test/deps/gmp-6.2.1/lib:/home/test/deps/mpfr-4.1.0/lib:/home/test/deps/mpc-1.2.1/lib:$LD_LIBRARY_PATH
```

## 3\. 源代码编译安装GCC

### 3.1. 下载最新版的GCC

可以直接从 [GCC, the GNU Compiler Collection](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/) 下载最新版本的 GCC 源码压缩包，在这里我通过 `wget`命令从[GCC mirror sites](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/mirrors.html) 服务器下载当前最新版本 GCC 源码压缩包。 关于 [GCC mirror sites](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/mirrors.html) 的选择可以浏览下面的网页：

[GCC mirror sites​gcc.gnu.org/mirrors.html](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/mirrors.html)

```bash
wget http://ftp.tsukuba.wide.ad.jp/software/gcc/releases/gcc-13.1.0/gcc-13.1.0.tar.gz
```

### 3.2. 编译安装 GCC

详细的 `configure` 参数设置可以参考：[Installing GCC: Configuration](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/install/configure.html)，这里我没有设置过多的参数。

```bash
tar -xvzf gcc-13.1.0.tar.gz
cd gcc-13.1.0
./configure \
--disable-multilib \
--prefix=$(pwd)/ \
--with-gmp-include=/home/test/deps/gmp-6.2.1/include \
--with-gmp-lib=/home/test/deps/gmp-6.2.1/lib \
--with-mpfr-include=/home/test/deps/mpfr-4.1.0/include \
--with-mpfr-lib=/home/test/deps/mpfr-4.1.0/lib \
--with-mpc-include=/home/test/deps/mpc-1.2.1/include \
--with-mpc-lib=/home/test/deps/mpc-1.2.1/lib
make -j4
make install
```

如果在make的过程遇见 `# error GATHER_STATISTICS must be defined` 这个错误,则只需通过在终端运行`export CPLUS_INCLUDE_PATH=` 命令暂时的清除CPLUS\_INCLUDE\_PATH 变量即可。

## 4\. 环境变量的配置

安装完 GCC 之后，我们需要将其配置到系统的环境变量中，如果需要长久生效，则需要将下面内容添加到 `~/.bashrc`中即可。也可以通过构建软链接的方式替换成老版本的GCC。

```bash
export PATH=/home/test/gcc-14.2.0/bin:$PATH
export LIBRARY_PATH=/home/test/gcc-14.2.0/lib64:$LIBRARY_PATH
export LD_LIBRARY_PATH=/home/test/gcc-14.2.0/lib64:$LD_LIBRARY_PATH
export C_INCLUDE_PATH=/home/test/gcc-14.2.0/include:$C_INCLUDE_PATH
export CPLUS_INCLUDE_PATH=/home/test/gcc-14.2.0/include:$CPLUS_INCLUDE_PATH
```
