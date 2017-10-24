#!/bin/sh
commitID=$1
echo $commitID
new_branch=branch$commitID
echo $new_branch
directory=$2
echo $directory
repo_path=$3
echo $repo_path
cd $repo_path
echo 'pwd is '
pwd
git branch -d $new_branch
echo git checkout -b $new_branch $commitID
git checkout -b $new_branch $commitID
# # git --work-tree=/Users/jitinnagpal/Documents/workspace/PatientsApp checkout -b new_branchbeafb5d30989f2edbe1fde03669eeca08a6444e3 beafb5d30989f2edbe1fde03669eeca08a6444e3
jenkins_path=$4
echo $jenkins_path
java -jar $jenkins_path -s $JENKINS_URL build PatientsApp
# # cd E:
# # cd Repos/testing
# # git checkout -b $new_branch $commitID
