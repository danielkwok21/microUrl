## What is a dump file?
A sql file containing all necessary commands to initialize database and tables

## How to generate dump file?
```bash
$ sudo mysqldump -u root -p --no-data micro_url_service > micro_url_service_dump.sql
```