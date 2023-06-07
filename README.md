<h1 align="center">
  🖱️ Experiment Using Mouse
</h1>

<h1 align="center">
    <img alt="Cover" src=".github/cover.png" />
</h1>

Project initially thought to build a graphic part of the exercise number `9.2` of the USP IME college's list of exercises for Computer Science ([link](https://www.ime.usp.br/~macmulti/caderno-exercicios-versao2005.pdf) to list of exercises), where the challenge is to help a mouse find a piece of cheese in a maze.

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

## Planned features
- [ ] Auditory effects
- [ ] Multiple players in one room
- [ ] Verifier of possible mazes to be completed

## Architecture
How this software works internally and how it interacts with external dependencies - written in detail at [`ARCHITECTURE`](./docs/architecture.md).

<img src="https://github.githubassets.com/images/mona-whisper.gif" align="right" />

## License
This project is under license. See the [`LICENSE`](./LICENSE) file for details.