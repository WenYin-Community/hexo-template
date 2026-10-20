---
title: "Shell、终端与配置文件合集"
author: "学姐大人"
date: 2023-06-29
categories:
  - "开发工具"
tags:
  - "zsh"
  - "shell"
  - "terminal"
  - "linux"
---

终端环境的个性化配置：自用的 .zshrc、neofetch、以及在国内网络下安装 oh-my-zsh。

<!-- more -->

<a id="zshrc-config-file"></a>

## 自用的.zshrc配置文件

偶然找到的，需要配置好 zsh 和 oh-my-zsh 方可使用。

```bash
#color{{{
autoload colors
colors
 
for color in RED GREEN YELLOW BLUE MAGENTA CYAN WHITE; do
eval _$color='%{$terminfo[bold]$fg[${(L)color}]%}'
eval $color='%{$fg[${(L)color}]%}'
(( count = $count + 1 ))
done
FINISH="%{$terminfo[sgr0]%}"
#}}}
 
#命令提示符
RPROMPT=$(echo "$RED%D %T$FINISH")
PROMPT=$(echo "$CYAN%n@$YELLOW%M:$GREEN%/$_YELLOW>$FINISH ")
 
#PROMPT=$(echo "$BLUE%M$GREEN%/
#$CYAN%n@$BLUE%M:$GREEN%/$_YELLOW>>>$FINISH ")
#标题栏、任务栏样式{{{
case $TERM in (*xterm*|*rxvt*|(dt|k|E)term)
precmd () { print -Pn "\e]0;%n@%M//%/\a" }
preexec () { print -Pn "\e]0;%n@%M//%/\ $1\a" }
;;
esac
#}}}
 
#编辑器
export EDITOR=vim
#输入法
export XMODIFIERS="@im=ibus"
export QT_MODULE=ibus
export GTK_MODULE=ibus
#关于历史纪录的配置 {{{
#历史纪录条目数量
export HISTSIZE=10000
#注销后保存的历史纪录条目数量
export SAVEHIST=10000
#历史纪录文件
export HISTFILE=~/.zhistory
#以附加的方式写入历史纪录
setopt INC_APPEND_HISTORY
#如果连续输入的命令相同，历史纪录中只保留一个
setopt HIST_IGNORE_DUPS
#为历史纪录中的命令添加时间戳
setopt EXTENDED_HISTORY      
 
#启用 cd 命令的历史纪录，cd -[TAB]进入历史路径
setopt AUTO_PUSHD
#相同的历史路径只保留一个
setopt PUSHD_IGNORE_DUPS
 
#在命令前添加空格，不将此命令添加到纪录文件中
#setopt HIST_IGNORE_SPACE
#}}}
 
#每个目录使用独立的历史纪录{{{
cd() {
builtin cd "$@"                             # do actual cd
fc -W                                       # write current history  file
local HISTDIR="$HOME/.zsh_history$PWD"      # use nested folders for history
if  [ ! -d "$HISTDIR" ] ; then          # create folder if needed
mkdir -p "$HISTDIR"
fi
export HISTFILE="$HISTDIR/zhistory"     # set new history file
touch $HISTFILE
local ohistsize=$HISTSIZE
HISTSIZE=0                              # Discard previous dir's history
HISTSIZE=$ohistsize                     # Prepare for new dir's history
fc -R                                       #read from current histfile
}
mkdir -p $HOME/.zsh_history$PWD
export HISTFILE="$HOME/.zsh_history$PWD/zhistory"
 
function allhistory { cat $(find $HOME/.zsh_history -name zhistory) }
function convhistory {
sort $1 | uniq |
sed 's/^:\([ 0-9]*\):[0-9]*;\(.*\)/\1::::::\2/' |
awk -F"::::::" '{ $1=strftime("%Y-%m-%d %T",$1) "|"; print }'
}
#使用 histall 命令查看全部历史纪录
function histall { convhistory =(allhistory) |
sed '/^.\{20\} *cd/i\\' }
#使用 hist 查看当前目录历史纪录
function hist { convhistory $HISTFILE }
 
#全部历史纪录 top50
function top50 { allhistory | awk -F':[ 0-9]*:[0-9]*;' '{ $1="" ; print }' | sed 's/ /\n/g' | sed '/^$/d' | sort | uniq -c | sort -nr | head -n 50 }
 
#}}}
 
#杂项 {{{
#允许在交互模式中使用注释  例如：
#cmd #这是注释
setopt INTERACTIVE_COMMENTS      
 
#启用自动 cd，输入目录名回车进入目录
#稍微有点混乱，不如 cd 补全实用
setopt AUTO_CD
 
#扩展路径
#/v/c/p/p => /var/cache/pacman/pkg
setopt complete_in_word
 
#禁用 core dumps
limit coredumpsize 0
 
#Emacs风格 键绑定
bindkey -e
#bindkey -v
#设置 [DEL]键 为向后删除
#bindkey "\e[3~" delete-char
 
#以下字符视为单词的一部分
WORDCHARS='*?_-[]~=&;!#$%^(){}<>'
#}}}
 
#自动补全功能 {{{
setopt AUTO_LIST
setopt AUTO_MENU
#开启此选项，补全时会直接选中菜单项
#setopt MENU_COMPLETE
 
autoload -U compinit
compinit
 
#自动补全缓存
#zstyle ':completion::complete:*' use-cache on
#zstyle ':completion::complete:*' cache-path .zcache
#zstyle ':completion:*:cd:*' ignore-parents parent pwd
 
#自动补全选项
zstyle ':completion:*' verbose yes
zstyle ':completion:*' menu select
zstyle ':completion:*:*:default' force-list always
zstyle ':completion:*' select-prompt '%SSelect:  lines: %L  matches: %M  [%p]'
 
zstyle ':completion:*:match:*' original only
zstyle ':completion::prefix-1:*' completer _complete
zstyle ':completion:predict:*' completer _complete
zstyle ':completion:incremental:*' completer _complete _correct
zstyle ':completion:*' completer _complete _prefix _correct _prefix _match _approximate
 
#路径补全
zstyle ':completion:*' expand 'yes'
zstyle ':completion:*' squeeze-shlashes 'yes'
zstyle ':completion::complete:*' '\\'
 
#彩色补全菜单
eval $(dircolors -b)
export ZLSCOLORS="${LS_COLORS}"
zmodload zsh/complist
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*:*:kill:*:processes' list-colors '=(#b) #([0-9]#)*=0=01;31'
 
#修正大小写
zstyle ':completion:*' matcher-list '' 'm:{a-zA-Z}={A-Za-z}'
#错误校正
zstyle ':completion:*' completer _complete _match _approximate
zstyle ':completion:*:match:*' original only
zstyle ':completion:*:approximate:*' max-errors 1 numeric
 
#kill 命令补全
compdef pkill=kill
compdef pkill=killall
zstyle ':completion:*:*:kill:*' menu yes select
zstyle ':completion:*:*:*:*:processes' force-list always
zstyle ':completion:*:processes' command 'ps -au$USER'
 
#补全类型提示分组
zstyle ':completion:*:matches' group 'yes'
zstyle ':completion:*' group-name ''
zstyle ':completion:*:options' description 'yes'
zstyle ':completion:*:options' auto-description '%d'
zstyle ':completion:*:descriptions' format $'\e[01;33m -- %d --\e[0m'
zstyle ':completion:*:messages' format $'\e[01;35m -- %d --\e[0m'
zstyle ':completion:*:warnings' format $'\e[01;31m -- No Matches Found --\e[0m'
zstyle ':completion:*:corrections' format $'\e[01;32m -- %d (errors: %e) --\e[0m'
 
# cd ~ 补全顺序
zstyle ':completion:*:-tilde-:*' group-order 'named-directories' 'path-directories' 'users' 'expand'
#}}}
 
##行编辑高亮模式 {{{
# Ctrl+@ 设置标记，标记和光标点之间为 region
zle_highlight=(region:bg=magenta #选中区域
special:bold      #特殊字符
isearch:underline)#搜索时使用的关键字
#}}}
 
##空行(光标在行首)补全 "cd " {{{
user-complete(){
case $BUFFER in
"" )                       # 空行填入 "cd "
BUFFER="cd "
zle end-of-line
zle expand-or-complete
;;
"cd --" )                  # "cd --" 替换为 "cd +"
BUFFER="cd +"
zle end-of-line
zle expand-or-complete
;;
"cd +-" )                  # "cd +-" 替换为 "cd -"
BUFFER="cd -"
zle end-of-line
zle expand-or-complete
;;
* )
zle expand-or-complete
;;
esac
}
zle -N user-complete
bindkey "\t" user-complete
#}}}
 
##在命令前插入 sudo {{{
#定义功能
sudo-command-line() {
[[ -z $BUFFER ]] && zle up-history
[[ $BUFFER != sudo\ * ]] && BUFFER="sudo $BUFFER"
zle end-of-line                 #光标移动到行末
}
zle -N sudo-command-line
#定义快捷键为： [Esc] [Esc]
bindkey "\e\e" sudo-command-line
#}}}
 
#命令别名 {{{
alias cp='cp -i'
alias mv='mv -i'
alias rm='rm -i'
alias ls='ls -F --color=auto'
alias ll='ls -al'
alias grep='grep --color=auto'
alias la='ls -a'
alias pacman='sudo pacman-color'
alias p='sudo pacman-color'
alias y='yaourt'
alias h='htop'
alias vim='sudo vim'
 
#[Esc][h] man 当前命令时，显示简短说明
alias run-help >&/dev/null && unalias run-help
autoload run-help
 
#历史命令 top10
alias top10='print -l  ${(o)history%% *} | uniq -c | sort -nr | head -n 10'
#}}}
 
#路径别名 {{{
#进入相应的路径时只要 cd ~xxx
hash -d A="/media/ayu/dearest"
hash -d H="/media/data/backup/ayu"
hash -d E="/etc/"
hash -d D="/home/ayumi/Documents"
#}}}
 
##for Emacs {{{
#在 Emacs终端 中使用 Zsh 的一些设置 不推荐在 Emacs 中使用它
#if [[ "$TERM" == "dumb" ]]; then
#setopt No_zle
#PROMPT='%n@%M %/
#>>'
#alias ls='ls -F'
#fi
#}}}
 
#{{{自定义补全
#补全 ping
zstyle ':completion:*:ping:*' hosts 192.168.1.{1,50,51,100,101} www.google.com
 
#补全 ssh scp sftp 等
#zstyle -e ':completion::*:*:*:hosts' hosts 'reply=(${=${${(f)"$(cat {/etc/ssh_,~/.ssh/known_}hosts(|2)(N) /dev/null)"}%%[# ]*}//,/ })'
#}}}
 
#{{{ F1 计算器
arith-eval-echo() {
LBUFFER="${LBUFFER}echo \$(( "
RBUFFER=" ))$RBUFFER"
}
zle -N arith-eval-echo
bindkey "^[[11~" arith-eval-echo
#}}}
 
####{{{
function timeconv { date -d @$1 +"%Y-%m-%d %T" }
 
# }}}
 
zmodload zsh/mathfunc
autoload -U zsh-mime-setup
zsh-mime-setup
setopt EXTENDED_GLOB
#autoload -U promptinit
#promptinit
#prompt redhat
 
setopt correctall
autoload compinstall
 
#漂亮又实用的命令高亮界面
setopt extended_glob
 TOKENS_FOLLOWED_BY_COMMANDS=('|' '||' ';' '&' '&&' 'sudo' 'do' 'time' 'strace')
 
 recolor-cmd() {
     region_highlight=()
     colorize=true
     start_pos=0
     for arg in ${(z)BUFFER}; do
         ((start_pos+=${#BUFFER[$start_pos+1,-1]}-${#${BUFFER[$start_pos+1,-1]## #}}))
         ((end_pos=$start_pos+${#arg}))
         if $colorize; then
             colorize=false
             res=$(LC_ALL=C builtin type $arg 2>/dev/null)
             case $res in
                 *'reserved word'*)   style="fg=magenta,bold";;
                 *'alias for'*)       style="fg=cyan,bold";;
                 *'shell builtin'*)   style="fg=yellow,bold";;
                 *'shell function'*)  style='fg=green,bold';;
                 *"$arg is"*)
                     [[ $arg = 'sudo' ]] && style="fg=red,bold" || style="fg=blue,bold";;
                 *)                   style='none,bold';;
             esac
             region_highlight+=("$start_pos $end_pos $style")
         fi
         [[ ${${TOKENS_FOLLOWED_BY_COMMANDS[(r)${arg//|/\|}]}:+yes} = 'yes' ]] && colorize=true
         start_pos=$end_pos
     done
 }
check-cmd-self-insert() { zle .self-insert && recolor-cmd }
 check-cmd-backward-delete-char() { zle .backward-delete-char && recolor-cmd }
 
 zle -N self-insert check-cmd-self-insert
 zle -N backward-delete-char check-cmd-backward-delete-char
```

<a id="neofetch-config-file"></a>

## neofetch常用的配置文件

效果如图：放置在~/.config/neofetch目录下，保存为config即可。

![](images/2017-06-05-23-07-05屏幕截图-300x199.png)

```bash
#!/usr/bin/env bash
# vim:fdm=marker
#
# Neofetch config file
# https://github.com/dylanaraps/neofetch

# Speed up script by not using unicode
export LC_ALL=C
export LANG=C

# Info Options {{{

# Info
# See this wiki page for more info:
# https://github.com/dylanaraps/neofetch/wiki/Customizing-Info
printinfo() {
    info title
    info underline

    info "Model" model
    info "OS" distro
    info "Kernel" kernel
    info "Uptime" uptime
    info "Packages" packages
    info "Shell" shell
    info "Resolution" resolution
    info "DE" de
    info "WM" wm
    info "WM Theme" wmtheme
    info "Theme" theme
    info "Icons" icons
    info "Terminal" term
    info "Terminal Font" termfont
    info "CPU" cpu
    info "GPU" gpu
    info "Memory" memory

    info "CPU Usage" cpu_usage
    info "Disk" disk
    info "Battery" battery
    info "Font" font
    info "Song" song
    info "Local IP" localip
    info "Public IP" publicip
    info "Users" users
    info "Birthday" birthday

    info linebreak
    info cols
    info linebreak
}
```

<a id="oh-my-zsh-install-in-china"></a>

## 在国内安装 oh-my-zsh

## 安装 zsh

Ubuntu 下：

```bash
apt-get install zsh
```

macOS 下：

```bash
brew install zsh
```

后面的内容两个系统通用。

## 安装 oh-my-zsh

```bash
wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
```

然后给 install.sh 添加权限：

```bash
chmod +x install.sh
```

然后执行 install.sh：

```bash
./install.sh
```

如果发现很慢，可以修改为 gitee：

```bash
vim install.sh
```

进入编辑状态，找到以下部分：

```bash
# Default settings
ZSH=${ZSH:-~/.oh-my-zsh}
REPO=${REPO:-ohmyzsh/ohmyzsh}
REMOTE=${REMOTE:-https://github.com/${REPO}.git}
BRANCH=${BRANCH:-master}
```

然后将中间两行改为：

```bash
REPO=${REPO:-mirrors/oh-my-zsh}
REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}
```

然后保存退出，重新执行即可。

[![](images/QQ图片20230629195511-640x370.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/06/QQ图片20230629195511.png)

---

版权声明：本文为 CSDN 博主「菜饼同学」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载时请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qwe641259875/article/details/107201760/
