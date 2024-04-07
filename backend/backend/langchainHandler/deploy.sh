aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 229965290704.dkr.ecr.ap-southeast-1.amazonaws.com/
docker build --platform=linux/amd64 -t jolteoncontainer .
docker tag jolteoncontainer:latest 229965290704.dkr.ecr.ap-southeast-1.amazonaws.com/jolteoncontainer:latest
docker push 229965290704.dkr.ecr.ap-southeast-1.amazonaws.com/jolteoncontainer