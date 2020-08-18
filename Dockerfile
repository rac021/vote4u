
## Github Project : https://github.com/rac021/i-vote-u

########################
# Step : Compile Jaxy ##
########################

FROM maven:3.6.0-jdk-8-alpine as compilation_stage

ADD . /tmp

WORKDIR /tmp

RUN mvn clean install


#########################
# Step : Package image ##
#########################

FROM openjdk:8u181-jdk-stretch

COPY jaxy/run.sh /app/jaxy/

COPY jaxy/demo/18_Docker/play_with_docker_script/jaxy_pwd_launcher.sh /app/

RUN chmod +x /app/jaxy/*.sh

COPY --from=compilation_stage /tmp/target/i-vote-you-runner.jar /app/

WORKDIR /app

ENTRYPOINT ["/app/run.sh"]

CMD [""]
