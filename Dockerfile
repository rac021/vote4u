
## Github Project : https://github.com/rac021/i-vote-u

########################
# Step : Compile Jaxy ##
########################

FROM maven:3.6.0-jdk-8-alpine as compilation_stage

ADD .   /tmp

WORKDIR /tmp

RUN ./build.sh


#########################
# Step : Package image ##
#########################

FROM openjdk:8u181-jdk-stretch

RUN apt-get update && apt-get install psmisc

COPY run_server.sh /app/

## Default Example ########################

COPY candidates.json /app/
COPY authorized-voters.properties /app/

###########################################
###########################################

RUN chmod +x /app/*.sh

COPY --from=compilation_stage /tmp/target/vote4u-1.0-runner.jar /app/

WORKDIR /app

ENTRYPOINT [ "./run_server.sh"]

CMD [""] 
