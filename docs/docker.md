## Docker

#### Run the application stack
```bash
$ docker compose up -d
# `-d` flag to run everything in the background

# logs
$ docker compose logs -f server
$ docker exec -it <mysql-container-id> mysql -p experiment-using-mouse
```

#### Tear it all down
```bash
$ docker compose down --volumes
```