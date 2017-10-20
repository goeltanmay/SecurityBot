#!/bin/sh
commitID=$1
echo $commitID
new_branch=branch+$commitID
echo $new_branch
cd E:
cd Repos/testing
git checkout -b $new_branch $commitID 

