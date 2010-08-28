#!/bin/bash

for i in `ls w/`
  do
    if [ -d w/$i ]
      then
        if [ w/$i != "w/thumbs" ]
          then
            inkscape -f w/$i/front.svg -e w/thumbs/$i.png
            convert -resize 35 w/thumbs/$i.png w/thumbs/$i.png
        fi
    fi
  done

for i in `ls b/`
  do
    if [ -d b/$i ]
      then
        if [ b/$i != "b/thumbs" ]
          then
            inkscape -f b/$i/back.svg -e b/thumbs/$i.png
            convert -resize 35 b/thumbs/$i.png b/thumbs/$i.png
        fi
    fi
  done
