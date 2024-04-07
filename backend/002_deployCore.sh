#!/bin/bash
VALID_COUNTRIES=("sg");
VALID_ENVIRONMENTS=("dev" "prod");
VALID_VERIFICATION_RESPONSES=("Y" "N" "y" "n");
APP_NAME="Jolteon";

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
  printColored "$APP_NAME Core-Stack Deployment CLI Tool";
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

getVar() {
    VAR=$(grep $1 "./configs/${ENVIRONMENT}.env" | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

AWS_CLI_PROFILE=$(getVar "AWS_CLI_PROFILE")
AWS_REGION=$(getVar "AWS_REGION")


verifyInstallation(){
    printHeader;
    printSeparator;
    printColored "Releasing $APP_NAME Core-Stack to $ENVIRONMENT environment using $ENVIRONMENT.env";
    printSeparator;
    printListItem "AWS CLI Profile: $AWS_CLI_PROFILE";
    printListItem "AWS Region: $AWS_REGION";
    printListItem "Environment: $ENVIRONMENT";
    printSeparator;
    echo -n "Are you sure you want to continue? (Y/N): "
    read CONFIRM_CODE
}

while true; do
    verifyInstallation
    
    if [[ " ${VALID_VERIFICATION_RESPONSES[*]} " == *" ${CONFIRM_CODE} "* ]];
    then
        break
    else
        printError "Invalid response, try again after 1 second."
        sleep 1
        printSeparator
    fi
done

clear



if [[ $CONFIRM_CODE == "Y" ]] || [[ $CONFIRM_CODE == "y" ]]
then
printSeparator
printHeader
printSeparator
printColored "Initiating deployment...";
printSeparator
else
clear;

printHeader
printSeparator
printError "Aborting deployment in 3 seconds... ";
sleep 1;
printError "Aborting deployment in 2 seconds... ";
sleep 1;
printError "Aborting deployment in 1 seconds... ";
sleep 1;
printSeparator
clear;
fi

STACK_NAME="${ENVIRONMENT}-jolteon-core-stack";

cd ./aws

if aws cloudformation describe-stacks --region "$AWS_REGION" --profile "$AWS_CLI_PROFILE" --stack-name "$STACK_NAME" &> /dev/null ; then
    aws cloudformation update-stack --region "$AWS_REGION" \
    --stack-name "${STACK_NAME}" \
    --template-body file://core-stack.yaml \
    --profile "${AWS_CLI_PROFILE}" \
    --parameters  ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \

else
    aws cloudformation create-stack --region "$AWS_REGION" \
    --stack-name "${STACK_NAME}" \
    --template-body file://core-stack.yaml \
    --profile "${AWS_CLI_PROFILE}" \
    --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \

fi

printSeparator
echo -n "Deployment complete!"
printSeparator
read -n 1 -s -r -p "Press any key to continue...."
clear;

                     

