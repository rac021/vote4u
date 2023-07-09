#!/bin/bash

 CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
 cd $CURRENT_PATH

 while [[ "$#" > "0" ]] ; do
 
     case $1 in
     
         (*=*) KEY=${1%%=*}
         
               VALUE=${1#*=}
               
               case "$KEY" in
               
                    ("keystore")   KEYSTORE_FILE="$VALUE"
                    ;;
                    ("password")   RAND_PASSWORD="$VALUE"
		    ;;                   
               esac
         ;;
         
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
 
 iVote4YouJar="vote4u-1.0-runner.jar"
 
 if [ ! -f $iVote4YouJar ]; then 
   
   iVote4YouJar="target/vote4u-1.0-runner.jar"
   
    if [ ! -f $iVote4YouJar ]; then 

       echo 
       echo "iVote4YouJar not Found ! "
       echo 
       exit 
       
    fi
 fi

 KEYSTORE_FILE=${KEYSTORE_FILE:-server.keystore}
 
 if [ $KEYSTORE_FILE == "server.keystore" ]; then 
    
    RAND_PASSWORD=`date +%s | sha256sum | base64 | head -c 32 ; echo`

    if [ -f $KEYSTORE_FILE ]; then 
      rm -f $KEYSTORE_FILE
    fi
    
    echo ; echo
    
    keytool -genkeypair   -storepass $RAND_PASSWORD -keyalg RSA    \
            -keysize 2048 -dname "CN=server"        -alias server  \
            -ext "SAN:c=DNS:localhost,IP:127.0.0.1"                \
            -keystore $KEYSTORE_FILE --noprompt 
    echo
 fi

######################################
  
 # jobs &>/dev/null
 
  fuser -k $HTTP_PORT/tcp 
  fuser -k $HTTPS_PORT/tcp 
 
  # quarkus.http.ssl.certificate.trust-store-password=password
 
  # http.http2=false ( can be used in java 11+ )
  
  echo "Deploying vote4u... "
  echo
  
  java $DEBUG                                                           \
       -Dquarkus.http.ssl.certificate.key-store-file=$KEYSTORE_FILE     \
       -Dquarkus.http.ssl.certificate.key-store-password=$RAND_PASSWORD \
       -jar $iVote4YouJar 

 # new_job_started="$(jobs -n)"
 
 # if [ -n "$new_job_started" ];then
 #   PID=$!
 # else
 #    PID=
 # fi
 
 # taskset -cp $LIST_CPU $PID
 
