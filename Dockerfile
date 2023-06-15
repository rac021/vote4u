
## Github Project : https://github.com/rac021/i-vote-u

########################
# Step : Compile Jaxy ##
########################

FROM maven:3.8.3-openjdk-17 as compilation_stage

ADD .   /tmp

WORKDIR /tmp

RUN ./build.sh


#########################
# Step : Package image ##
#########################

FROM openjdk:17.0.1-jdk-slim

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
