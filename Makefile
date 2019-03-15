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

docker_exec_web := docker-compose exec web

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
	docker-compose exec web npm install
	make app-create-database
	make init-hooks

## to run app
infra-up:
	docker-compose up -d

## to stop all the containers
infra-stop:
	docker-compose stop

## to create the database if it does not exist
app-create-database:
    docker-compose exec web node_modules/.bin/sequelize db:create

## to open a sh session in the node container
infra-shell-node:
	$(docker_exec_web) sh

## to run sequelize migrations
app-db-migrate:
	docker-compose exec web node_modules/.bin/sequelize db:migrate

## to run down sequelize migrations
app-db-unmigrate:
	docker-compose exec web node_modules/.bin/sequelize db:migrate:undo

## to show logs from containers, specify "c=service_name" to filter logs by container
infra-show-logs:
	docker-compose logs -ft ${c}

## to show files that need to be fixed
app-cs-check: 
	$(docker_exec_web) sh -c './node_modules/prettier/bin-prettier.js --check "**/*.js"'

## to fix files that need to be fixed
app-cs-fix: 
	$(docker_exec_web) sh -c './node_modules/prettier/bin-prettier.js --write "**/*.js"'

