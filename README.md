# scorefive-graphql

This project is a GraphQL backend for the [scorefive card game](https://www.scorefive.app)

It is built with Bun, Apollo Server, Prisma, and PostgreSQL.

It is designed for use with VSCode.

## Environment Setup

1. Install [Bun](https://bun.com)

```bash
$ curl -fsSL https://bun.sh/install | bash
```

Check the Bun website for the most up to date installation instructions

2. Install Docker Desktop

You can download the most recent version from the [Docker documentation website](https://docs.docker.com)

3. Set up dependencies

```bash
$ bun install
```

4. Set up environment variables

```bash
$ cp .env.example .env
```

Edit `.env` and fill out the appropriate values.

## Development Workflow

To start the server:

```shell
$ bun start
```

To run code generation (prisma orm models and graphql resolver + response models):

```shell
$ bun generate
```

To typecheck the project:

```shell
$ bun compile
```

To check for linting and formatting issues:

```shell
$ bun check
```

To correct any linting and formatting issues that can be fixed with autocorrect:

```shell
$ bun fix
```

To start and stop the PG database with Docker compose:

```shell
$ bun db:up
$ bun db:down
```

To perform database migrations:

```shell
$ bun migrate:dev
```

To reset the database and re-apply all migrations sequentially:

```shell
$ bun migrate:reset
```

To explore the database locally and inspect its contents:

```shell
$ bun db:explore
```
