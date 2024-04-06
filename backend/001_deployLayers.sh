#!/bin/bash
VALID_COUNTRIES=("sg");
VALID_ENVIRONMENTS=("dev" "prod");
VALID_VERIFICATION_RESPONSES=("Y" "N" "y" "n");
APP_NAME="jolteon";

printSeparator() {
    echo -e ""
    echo -e ""
}

printColored() {
    TEXT="${1}";

    printf "\e[38;2;0;0;255m${TEXT} \e[0m\n";
}

printError() {
    TEXT="${1}";

    printf "\e[38;2;0;0;255m${TEXT}\e[0m\n";
}

printListItem() {
    TEXT="${1}";
    CHECK_MARK="\e[38;2;0;0;255m\xE2\x9C\x94\e[0m";

    echo -e "${CHECK_MARK} ${TEXT}";
}

printHeader() {
    clear;
    
    printColored "|-------------------|"
    printColored "|===== Jolteon  ====|"
    printColored "|___________________|"

}
   
  
collectEnvironment() {
  printHeader
  printSeparator;
  printColored "$APP_NAME Layers Deployment CLI Tool";
  printSeparator;
  echo -n "0). Enter Environment (${VALID_ENVIRONMENTS[*]}): "
  read ENVIRONMENT
}

while true; do
    collectEnvironment
    
    if [[ " ${VALID_ENVIRONMENTS[*]} " == *" ${ENVIRONMENT} "* ]];
    then
        break
    else
        printError "Invalid environment, try again after 1 second."
        sleep 1
        printSeparator
    fi
done
printSeparator;
 
# Get Environment variables from .env files
getVar() {
    VAR=$(grep $1 "./configs/${ENVIRONMENT}.env" | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

AWS_REGION=$(getVar "AWS_REGION")
AWS_S3_ARTIFACT_STORE=$(getVar "ARTIFACT_STORE")
AWS_CLOUDFORMATION_ARTIFACT_PATH=$(getVar "ARTIFACT_PATH")
STACK_NAME=$(getVar "STACK_NAME")

AWS_CLOUDFORMATION_STACK_NAME="${ENVIRONMENT}-${STACK_NAME}-layers"


verifyInstallation(){
    printHeader
    printSeparator;
    printColored "Releasing $APP_NAME with the following settings:";
    printSeparator;
    printColored "AWS Region: ${AWS_REGION}";
    printColored "AWS S3 Artifact Store: ${AWS_S3_ARTIFACT_STORE}";
    printColored "AWS CloudFormation Artifact Path: ${AWS_CLOUDFORMATION_ARTIFACT_PATH}";
    printColored "AWS CloudFormation Stack Name: ${AWS_CLOUDFORMATION_STACK_NAME}";
    printSeparator;
    echo -n "1). Is the above information correct? (Y/N): "
    read RESPONSE
}

while true; do
    verifyInstallation

    if [[ " ${VALID_VERIFICATION_RESPONSES[*]} " == *" ${RESPONSE} "* ]];
    then
        break
    else
        printError "Invalid response, try again after 1 second."
        sleep 1
        printSeparator
    fi
done

if [[ $RESPONSE == "Y" ]] || [[ $RESPONSE == "N" ]] || [[ $RESPONSE == "y" ]] || [[ $RESPONSE == "n" ]]

then
    printSeparator;
    printColored "Initialising Deployment...";
    printSeparator;
    
else
    clear
    printSeparator;
    printError "Stack release aborted. Press any key to exit";
    read
    clear
fi

# For windows users
UNAME=$(uname)

if [[ "$UNAME" == CYGWIN* || "$UNAME" == MINGW* ]] ; then
  echo "Windows machine detected..."
  alias sam='sam.cmd'
fi


# Package the cloudformation template for application layers deployment
echo "Packaging..."
sam package --template-file ./aws/layers.yaml \
    --s3-bucket $AWS_S3_ARTIFACT_STORE \
    --s3-prefix $AWS_CLOUDFORMATION_ARTIFACT_PATH \
    --region    $AWS_REGION \
    --output-template-file ./aws/layers.cfn.yaml \

echo "Deploying..."

# Deploy the cloudformation template for application layers deployment
sam deploy --template-file ./aws/layers.cfn.yaml \
    --stack-name $AWS_CLOUDFORMATION_STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --region $AWS_REGION \
    --parameter-overrides ParameterKey=Environment,ParameterValue=$ENVIRONMENT


# Say congrats, offer beer and goodbye :)
printSeparator;
echo -n "Deployment complete! 🍺 🍺 🍺";
printSeparator;
read -n 1 -s -r -p "Press any key to continue....";
clear;