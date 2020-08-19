# vote4u

## Docker Deployment :

```
  docker run --rm -d --name vote                                                      \
             -v $(pwd)/authorized-voters.properties:/app/authorized-voters.properties \
             -v $(pwd)/candidates.json:/app/candidates.json                           \
             -p 8080:8080                                                             \
             -p 8585:8585  rac021/vote4u

```

