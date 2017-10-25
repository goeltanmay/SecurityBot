#!/bin/sh
# pullRequestID=$1
# #echo $pullRequestID
# new_branch=branch$pullRequestID
# #echo $new_branch
# git fetch origin pull/$pullRequestID/head:$new_branch
# git checkout $new_branch

echo 'running pull_request script'
pullRequestID=$1
echo $pullRequestID
new_branch=branch$pullRequestID
echo $new_branch
directory=$2
echo $directory
repo_path=$3
echo $repo_path
cd $repo_path
echo 'pwd is '
pwd
git fetch origin pull/$pullRequestID/head:$new_branch
git checkout $new_branch
jenkins_path=$4
echo $jenkins_path
java -jar $jenkins_path -s $JENKINS_URL build PatientsApp
