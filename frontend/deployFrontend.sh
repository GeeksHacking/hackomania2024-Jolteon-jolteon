#!/bin/bash
printSeparator() {
    echo -e ""
    echo -e ""
}

printColored() {
    TEXT="${1}";

    printf "\e[38;2;248;138;0m${TEXT} \e[0m\n";
}

printError() {
    TEXT="${1}";

    printf "\e[38;2;255;0;0m${TEXT}\e[0m\n";
}

printListItem() {
    TEXT="${1}";
    CHECK_MARK="\e[38;2;0;255;0m\xE2\x9C\x94\e[0m";

    echo -e "${CHECK_MARK} ${TEXT}";
}

printHeader() {
    clear;
    printColored "|-------------------|"
    printColored "|===== Jolteon  ====|"
    printColored "|___________________|"

}





s3_bucket="dev-jolteon";
CLOUDFRONT_DISTRIBUTION_ID="E1GB8RCICESV1T";
AWS_REGION="ap-southeast-1";
filename="index.html";
aws_cli_profile="aks";

verifyInstallation() {
  printHeader;
  printSeparator;
  printColored "Jolteon Web Interface - Frontend CLI";
  printSeparator;
  printColored "Releasing Jolteon Web Frontend";
  printSeparator;
  printListItem "AWS_REGION = ${AWS_REGION}";
  printListItem "S3 Bucket = ${s3_bucket}";
  printListItem "CLOUDFRONT_DISTRIBUTION_ID = ${CLOUDFRONT_DISTRIBUTION_ID}";
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
  printColored "Starting deployment...";
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
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   1. Build ... >>>>>>>>>>>>>>>>>>>>>>>"
echo "Building frontend..."
echo "npx vite build"

npx vite build



echo ""
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   2. Upload to AWS ... >>>>>>>>>>>>>>>>>>>>>>>"


echo "aws s3 cp dist/assets/ s3://$s3_bucket/assets/ --recursive --profile $aws_cli_profile"

aws s3 cp dist/assets/ s3://$s3_bucket/assets/ --recursive --profile $aws_cli_profile

echo "aws s3 cp dist/index.html s3://$s3_bucket/$filename --profile $aws_cli_profile"

aws s3 cp dist/index.html s3://$s3_bucket/$filename --profile $aws_cli_profile


echo ""
echo ""
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   3. Invalidate CloudFront ... >>>>>>>>>>>>>>>>>>>>>>>"
echo ""
echo "aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "$filename" --profile $aws_cli_profile"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/$filename" --profile $aws_cli_profile
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/assets/*" --profile $aws_cli_profile


echo ""
echo "DONE"
echo ""