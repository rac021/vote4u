# i-vote-u

## Docker Deployment :

```
  docker run -d --name vote -p 8080:8080 -v (pwd)/authentication.properties:/app/authentication.properties -v (pwd)/voters.json:/app/voters.json -p 8585:8585 vote
vote

```
