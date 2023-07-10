# vote4u

## Docker Deployment :

```
  docker run --rm -d --name vote                                                      \
             -v $(pwd)/authorized-voters.properties:/app/authorized-voters.properties \
             -v $(pwd)/candidates.json:/app/candidates.json                           \
             -p 8080:8080                                                             \
             -p 8585:8585  rac021/vote4u
```
## With TLS/SSL Cetificate ( Let's Encrypt ) :

```
  docker run --rm -d --name vote                                                      \
             -v $(pwd)/authorized-voters.properties:/app/authorized-voters.properties \
             -v $(pwd)/candidates.json:/app/candidates.json                           \
             -v $(pwd)/letsEncrypt_Cert/APP.jks:/app/server/APP.jks                   \
             -p 8080:8080                                                             \
             -p 8585:8585  rac021/vote4u                                              \
             keystore="/app/server/APP.jks" password=123456789
```
