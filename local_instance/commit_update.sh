#!/bin/sh
commitID=$1
echo $commitID
new_branch=branch$commitID
echo $new_branch
directory=$2
echo 'directory is'
echo $directory
repo_path=$3
echo 'repo path is '
echo $repo_path
cd $repo_path
pwd
echo git checkout -b $new_branch $commitID
# git checkout master
sudo git pull origin master
sudo git checkout -b $new_branch $commitID
echo bhanched_checked_out......
# git --work-tree=/Users/jitinnagpal/Documents/workspace/PatientsApp checkout -b new_branchbeafb5d30989f2edbe1fde03669eeca08a6444e3 beafb5d30989f2edbe1fde03669eeca08a6444e3
jenkins_path=$4
JENKINS_URL=$6
# echo $jenkins_path
echo java -jar $jenkins_path -s $JENKINS_URL build $5
sudo java -jar $jenkins_path -s $JENKINS_URL build $5
# cd E:
# cd Repos/testing
# git checkout -b $new_branch $commitID
