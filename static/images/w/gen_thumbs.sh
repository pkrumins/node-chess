#!/bin/bash

for i in `ls`
  do
    if [ -d $i ]
      then
        if [ $i != "thumbs" ]
          then
            inkscape -f $i/front.svg -e thumbs/$i.png
            convert -resize 35 thumbs/$i.png thumbs/$i.png
        fi
    fi
  done
