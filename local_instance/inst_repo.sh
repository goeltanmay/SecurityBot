#!/bin/sh
repo_path=$1
echo 'repo path is '
echo $repo_path
cd $repo_path
# git pull origin maste
sudo git fetch
# git --work-tree=/Users/jitinnagpal/Documents/workspace/PatientsApp checkout -b new_branchbeafb5d30989f2edbe1fde03669eeca08a6444e3 beafb5d30989f2edbe1fde03669eeca08a6444e3
jenkins_path=$2
JENKINS_URL=$4
echo $jenkins_path
echo java -jar $jenkins_path -s $JENKINS_URL build $3
sudo java -jar $jenkins_path -s $JENKINS_URL build $3
# cd E:
# cd Repos/testing
# git checkout -b $new_branch $commitID
