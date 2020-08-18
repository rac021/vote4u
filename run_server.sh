#!/bin/bash

 CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
 cd $CURRENT_PATH

 while [[ "$#" > "0" ]] ; do
 
  case $1 in
   
      debug)  DEBUG="-Xdebug -Xrunjdwp:transport=dt_socket,address=11555,server=y,suspend=y "      
      ;; 
      
  esac
  
  shift
  
 done 

######################################
##### SERVER CONFIG ##################
######################################

 ## SERVER PORT ######################

 HTTP_PORT=${HTTP_PORT:-"8080"}
 
 HTTPS_PORT=${HTTPS_PORT:-"8585"}

 ####################################
 ####################################
 
 KEYSTORE_FILE="server.keystore"
 
 RAND_PASSWORD=`date +%s | sha256sum | base64 | head -c 32 ; echo`
 
 iVoteYouJar="i-vote-you-1.0-runner.jar"
 
 if [ ! -f $iVoteYouJar ]; then 
   
   iVoteYouJar="target/i-vote-you-1.0-runner.jar"
   
    if [ ! -f $iVoteYouJar ]; then 

       echo 
       echo "iVoteYouJar not Found ! "
       echo 
       exit 
       
    fi
 fi
  
 # LIST_CPU="0-7" #  0 ( Only one core ) Or  0,1 ( core 0 and core 1 ) Or 0-4 ( for core 0 to core 4 ) 
 
 if [ -f $KEYSTORE_FILE ]; then 
   rm -f $KEYSTORE_FILE
 fi
 
 echo ; echo
 
 keytool -genkeypair   -storepass $RAND_PASSWORD -keyalg RSA    \
         -keysize 2048 -dname "CN=server"        -alias server  \
         -ext "SAN:c=DNS:localhost,IP:127.0.0.1"                \
         -keystore $KEYSTORE_FILE --noprompt 

 echo

######################################
  
 # jobs &>/dev/null
 
  fuser -k $HTTP_PORT/tcp 
  fuser -k $HTTPS_PORT/tcp 
 
  # quarkus.http.ssl.certificate.trust-store-password=password
 
  # http.http2=false ( can be used in java 11+ )
  
  echo
  echo "Deploying i-vote-you.. "
  echo
  
  java $DEBUG                                                           \
       -Dquarkus.http.ssl.certificate.key-store-file=$KEYSTORE_FILE     \
       -Dquarkus.http.ssl.certificate.key-store-password=$RAND_PASSWORD \
       -jar $iVoteYouJar 

 # new_job_started="$(jobs -n)"
 
 # if [ -n "$new_job_started" ];then
 #   PID=$!
 # else
 #    PID=
 # fi
 
 # taskset -cp $LIST_CPU $PID
 
