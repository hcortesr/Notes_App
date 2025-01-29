
const { pool } = require('./sqlConnection.js');


const getInfo = async () => {
    try {
        const data = await pool.query('SELECT * FROM users_info');
        console.log(data);
    } catch (error) {
        console.error(error);        
    }
    pool.end();
}
console.log("aux");
getInfo();