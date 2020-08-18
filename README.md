# i-vote-u

## Docker Deployment :

```
  docker run -d --name vote                                                     \
             -v $(pwd)/authentication.properties:/app/authentication.properties \
             -v $(pwd)/voters.json:/app/voters.json                             \
             -p 8080:8080                                                       \
             -p 8585:8585 vote

```

