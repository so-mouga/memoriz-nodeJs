.SILENT:
.PHONY: build test

## Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

## Detect OS and Architecture
## OS
OSFLAG 				:=
ifeq ($(OS),Windows_NT)
	OSFLAG = WIN32
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OSFLAG = LINUX
	endif
	ifeq ($(UNAME_S),Darwin)
		OSFLAG = OSX
	endif
endif

## ARCHITECTURE
ArchitectureFLAG :=
ifeq ($(OSFLAG),WIN32)
	ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
		ArchitectureFLAG = AMD64
	endif
	ifeq ($(PROCESSOR_ARCHITECTURE),x86)
		ArchitectureFLAG = IA32
	endif
else
	UNAME_P := $(shell uname -p)
	ifeq ($(UNAME_P),x86_64)
		ArchitectureFLAG = AMD64
	endif
	ifneq ($(filter %86,$(UNAME_P)),)
		ArchitectureFLAG = IA32
	endif
	ifneq ($(filter arm%,$(UNAME_P)),)
		ArchitectureFLAG = ARM
	endif
endif

## Help
help:
	printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	printf " make [target]\n\n"
	printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	awk '/^[a-zA-Z\-\_0-9\.@]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

###############
# COMMANDE #
###############

## initialize a git config to use hooks
init-hooks:
	git config --local core.hooksPath .githooks
ifneq ($(OSFLAG),WIN32)
	chmod -R +x .githooks
endif	

## to install app
app-install:
	docker-compose up -d --build
	docker-compose exec web npm install
	make init-hooks

## to run app
infra-up:
	docker-compose up -d

## to stop all the containers
infra-stop:
	docker-compose stop

## to open a sh session in the node container
infra-shell-node:
	docker-compose exec web sh

## to run sequelize migrations
app-db-migrate:
	docker-compose exec web node_modules/.bin/sequelize db:migrate
