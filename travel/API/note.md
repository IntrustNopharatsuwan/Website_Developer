# Create Connection MySQL
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'travel'
})

----


# Simple Query MySQL
connection.query(
    'SELECT * FROM `attractions` WHERE `latitude` > 0 AND `longitude` > 0 LIMIT 3',
    function(err, results, fields){
        console.log(results);
        console.log(fields);
    }
);

----

# Using Prepared Statements
const page = parseInt(req.query.page);
const per_page = parseInt(req.query.per_page);
console.log(page, per_page)
connection.execute(
    'SELECT * FROM `attractions` WHERE `latitude` > 0 AND `longitude` > 0 LIMIT ?,?'
    [page,per_page],
    function(err, results, fields){
        // console.log(results);
        res.json({results:results})
    }
)