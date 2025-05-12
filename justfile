alias b := build
alias r := run

dev:
	reflex -r 'main' just run

fmt:
	go fmt cmd/xyter/main.go
	goimports-reviser -rm-unused -set-alias ./...

lint:
	golangci-lint run

build:
	go build cmd/xyter/main.go

run:
	go run cmd/xyter/main.go
