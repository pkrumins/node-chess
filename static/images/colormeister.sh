#!/bin/bash

#use: ./colormeister.sh old_color new_color set
#originally b3b3b3 to cccccc
for i in `ls $3`; do
    if [ -d $3/$i ]; then
        if [ $i != "thumbs" ]; then
            for j in `ls $3/$i`; do 
                sed s/#$1/#$2/ $3/$i/$j > $3/$i/$j.2; mv $3/$i/$j.2 $3/$i/$j; 
            done
        fi
    fi
done
