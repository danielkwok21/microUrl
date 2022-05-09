import config from '../config/index'
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
});

function db(query: string) {
    return new Promise((res, rej) => {
        con.connect(function (err) {
            if (err) {
                rej(err)
            } else {

                con.query(query, function (err, result: any[]) {
                    if (err) {
                        rej(err)
                    } else {
                        res(result)
                    }
                });

            }
        });
    })
}

export default db
