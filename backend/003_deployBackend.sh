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
  printColored "$APP_NAME Backend-Stack Deployment CLI Tool";
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


ARTIFACT_STORE=$(getVar ARTIFACT_STORE);
ARTIFACT_PATH=$(getVar ARTIFACT_PATH);
ECR_REPOSITORY_URI=$(getVar ECR_REPOSITORY_URI);

APPLICATION_EVENT_STORE_NAME=$(getVar APPLICATION_EVENT_STORE_NAME);
APPLICATION_USER_TABLE=$(getVar APPLICATION_USER_TABLE);
APPLICATION_USER_AUTHORIZATION_TABLE=$(getVar APPLICATION_USER_AUTHORIZATION_TABLE);
APPLICATION_FRONTEND_URI=$(getVar APPLICATION_FRONTEND_URI);
APPLICATION_REDIRECT_URL=$(getVar APPLICATION_REDIRECT_URL);
AWS_REGION=$(getVar AWS_REGION);


BACKEND_STACK_NAME="${ENVIRONMENT}-sbn-infocard-backend-stack";
SHARED_LAMBDA_LAYER_NAME=$(getVar SHARED_LAMBDA_LAYER_NAME);
PERSONNEL_IMAGE_BUCKET=$(getVar PERSONNEL_IMAGE_BUCKET);
GENERATED_CARD_OUTPUT_BUCKET=$(getVar GENERATED_CARD_OUTPUT_BUCKET);

QUERY_LAMBDA_LAYER_NAME="${ENVIRONMENT}-${SHARED_LAMBDA_LAYER_NAME}";

echo "aws lambda list-layer-versions --layer-name ${QUERY_LAMBDA_LAYER_NAME} --query 'max_by(LayerVersions, &Version).LayerVersionArn' --output text | xargs"
SHARED_LAMBDA_LAYER_ARN=$(aws lambda list-layer-versions --layer-name ${QUERY_LAMBDA_LAYER_NAME} --query 'max_by(LayerVersions, &Version).LayerVersionArn' | xargs)
# SHARED_LAMBDA_LAYER_ARN="arn:aws:lambda:ap-southeast-1:353942955042:layer:dev-sbn-infocard-shared-layer:18"
echo "$SHARED_LAMBDA_LAYER_ARN"

SBNInfocardUsersTableStreamArn=$(aws dynamodb describe-table --table-name $APPLICATION_USER_TABLE --query "Table.LatestStreamArn" --output text)
echo "Infocard Users Table DynamoDB StreamARN: $SBNInfocardUsersTableStreamArn"



verifyInstallation() {
    printHeader;
    printSeparator;
    printColored "SBN Infocard - Backend CLI";
    printSeparator;
    printColored "Releasing whatsapp chatbot backend using ${ENVIRONMENT}.env";
    printSeparator;
    printListItem "ENVIRONMENT_CODE = ${ENVIRONMENT}";
    printListItem "ARTIFACT_STORE = ${ARTIFACT_STORE}";
    printListItem "ARTIFACT_PATH = ${ARTIFACT_PATH}";
    printListItem "APPLICATION_FRONTEND_URI = ${APPLICATION_FRONTEND_URI}";
    printListItem "APPLICATION_REDIRECT_URL = ${APPLICATION_REDIRECT_URL}";
    printListItem "APPLICATION_EVENT_STORE_NAME = ${APPLICATION_EVENT_STORE_NAME}";
    printListItem "AWS_REGION = ${AWS_REGION}";
    printListItem "BACKEND_STACK_NAME = ${BACKEND_STACK_NAME}";
    printListItem "SHARED_LAMBDA_LAYER_NAME = ${ENVIRONMENT}-${SHARED_LAMBDA_LAYER_NAME}";
    printListItem "SHARED_LAMBDA_LAYER_ARN = ${SHARED_LAMBDA_LAYER_ARN}";
    printListItem "User Table DynamoDB StreamARN = ${SBNInfocardUsersTableStreamArn}";

    printSeparator;
    echo -n "3). Do you want to continue? ([Y]es, [N]o): "
    read CONFIRM_CODE
}


while true; do
    verifyInstallation
    if [[ $CONFIRM_CODE == "Y" ]] || [[ $CONFIRM_CODE == "N" ]] || [[ $CONFIRM_CODE == "y" ]] || [[ $CONFIRM_CODE == "n" ]]
    then
        break
    else
        printError "Invalid value."
        sleep 1
        printSeparator
    fi
done


if [[ $CONFIRM_CODE == "Y" ]] || [[ $CONFIRM_CODE == "y" ]]
then
    clear;
    printSeparator
    printHeader
    printSeparator
    printColored "SBN Tech Infocard - Backend CLI";
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


cd ./aws


# Deploy
echo "Packaging..."
sam package --template-file backend-stack.yaml \
    --s3-bucket "${ARTIFACT_STORE}" \
    --s3-prefix "${ARTIFACT_PATH}" \
    --image-repository "${ECR_REPOSITORY_URI}" \
    --output-template-file ./backend-stack-packaged.yaml \
    --region "$AWS_REGION"




echo "Deploying..."


printListItem "${COUNTRY_CODE}"
printListItem "${ENVIRONMENT}"
printListItem "${SHARED_LAMBDA_LAYER_ARN}"
printListItem "${AWS_REGION}"
printListItem "${APPLICATION_EVENT_STORE_NAME}"




sam deploy --template-file ./backend-stack-packaged.yaml \
    --s3-bucket "${ARTIFACT_STORE}" \
    --s3-prefix "${ARTIFACT_PATH}" \
    --stack-name $BACKEND_STACK_NAME \
    --image-repository "${ECR_REPOSITORY_URI}" \
    --parameter-overrides ParameterKey=CountryCode,ParameterValue=$COUNTRY_CODE \
    ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
    ParameterKey=SharedLayerArn,ParameterValue=$SHARED_LAMBDA_LAYER_ARN \
    ParameterKey=ApplicationUserTableName,ParameterValue=$APPLICATION_USER_TABLE \
    ParameterKey=ApplicationAuthorizationTableName,ParameterValue=$APPLICATION_USER_AUTHORIZATION_TABLE \
    ParameterKey=ApplicationFrontendURL,ParameterValue=$APPLICATION_FRONTEND_URI \
    ParameterKey=ApplicationRedirectURL,ParameterValue=$APPLICATION_REDIRECT_URL \
    ParameterKey=ApplicationPersonnelImageBucket,ParameterValue=$PERSONNEL_IMAGE_BUCKET \
    ParameterKey=SBNInfocardUsersTableStreamArn,ParameterValue=$SBNInfocardUsersTableStreamArn \
    ParameterKey=ApplicationGeneratedCardBucket,ParameterValue=$GENERATED_CARD_OUTPUT_BUCKET \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --region "$AWS_REGION"


# Done
printSeparator;
echo -n "Deployment complete!";
printSeparator;
read -n 1 -s -r -p "Press any key to continue....";
clear;



