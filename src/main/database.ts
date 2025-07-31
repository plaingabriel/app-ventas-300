import mysql from 'promise-mysql'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ventas300'
})

function getConnection() {
  return connection
}

export default getConnection
