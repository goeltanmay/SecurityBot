#!/bin/sh
pullRequestID=$1
echo $pullRequestID
new_branch=branch+$pullRequestID
echo $new_branch
git fetch origin pull/$pullRequestID/head:$new_branch
git checkout $new_branch
