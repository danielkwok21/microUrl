# Key Generation Service

## What is this
Generates a list of unique ids into a table (availableKeys).
When `GET /key` is called, id would be returned, and deleted from this table, and moved to another table (unavailableKeys).

## Stack
- Express
- Nodejs
- mySQL
- Redis

## Project setup
https://www.split.io/blog/node-js-typescript-express-tutorial/