#!/bin/sh
export GIT_COMMIT=$(git rev-parse --short HEAD)

go build -ldflags "-X main.GitCommit=$GIT_COMMIT" github.com/jieidson/arp/cmd/arp
env GOOS=windows go build -ldflags "-X main.GitCommit=$GIT_COMMIT" github.com/jieidson/arp/cmd/arp
