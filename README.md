<p align="center">
    <a href="https://zupimages.net/up/19/11/symc.png">
        <img src="https://zupimages.net/up/19/11/symc.png" width="500">
    </a>
</p>

[![Build Status](https://travis-ci.org/so-mouga/memoriz-back.svg?branch=develop)](https://travis-ci.org/so-mouga/memoriz-back)

## Description

Memo-riz is an application fun learning, The learning games "Memo-riz" are questionnaire, crossword and more.

## Global prerequisites

You will need [Docker](https://docs.docker.com/engine/installation/),
[Docker Compose](https://docs.docker.com/compose/install/),
[Ionic](https://ionicframework.com/docs/installation/cli#install-the-ionic-cli)
and Make command to execute some commands. So you have to install these tools first.

Make sure you have no local running services on ports `3000`, `5432` and `8081` before continuing with the installation process.

## Project prerequisites

This project is split in 2 part:

Front: [ionic 4](https://github.com/so-mouga/memoriz-front)
<br/>
Back: [node-js](https://github.com/so-mouga/memoriz-back)

## Installation

Clone the Git repository on the develop branch for development environment:

```bash
$ git clone https://github.com/so-mouga/memoriz-back.git -b develop
```

Very simple, only a few steps to execute from your host machine:

1. go to the folder: `cd memoriz-back`
2. creates and start the containers: :`make infra-up`
3. install the project: `make app-install`
4. install and run the [front](https://github.com/so-mouga/memoriz-front)

## Local

Containers are running:

| Containers | ports  |
| :--------: | :----: |
|  postgres  | `5432` |
|    node    | `3000` |
|  adminer   | `8081` |

## Contributing

If you want participate to the project you can check the
[Trello](https://trello.com/b/7ZnFkfqk/memoriz) or suggest us some things :)

## Pull Requests process

Here's some information to the workflow process to contribute

- Target your branch from `develop`
- Uniform the code style with `make app-cs-fix`
- Please follow these rules for the message commit <br/>
  commit message example : `type(context): A simple description`

|   type   |                       description                        |
| :------: | :------------------------------------------------------: |
|  build   |         Changing or update dependencies (npm...)         |
|   feat   |                Adding a new functionality                |
|   fix    |                       Fixing a bug                       |
| refactor | Changing that does not bring new features or improvement |
|   test   |                 Adding or updating test                  |
|   perf   |                 Performance improvement                  |
|  chore   |          All which don't match with type above           |

- Follow the rules of template to create your Pull request to describe your PR
- Add the label which corresponds
- Assign your PR to a member of the team
