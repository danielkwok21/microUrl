# Key Generation Service

## What is this
Generates a list of unique ids into a table (availableKeys).
When `GET /key` is called, id would be returned, and deleted from this table, and moved to another table (unavailableKeys).

## Getting started
1. Start mysql service
```bash
$ sudo systemctl start mysql
$ sudo systemctl status mysql
```

2. Start redis service
```bash
$ sudo systemctl start redis.service
$ sudo systemctl status redis.service
```

3. Start app

Assuming you're already at project root directory.
```bash
$ cd /app
$ nodemon keyGenerationService.ts
```

## Stack
- Express
- Nodejs
- mySQL
- Redis

## Project setup
https://www.split.io/blog/node-js-typescript-express-tutorial/