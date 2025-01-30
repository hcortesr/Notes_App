const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
  host: "srv961.hstgr.io",
  user: "u123882835_first_user",
  password: "$8RBule7mEPo",
  database: "u123882835_note_app",
});

const getPassUser = async (id_user) => {
  try {
    const queryT = `SELECT * FROM users_info WHERE id_user=?`;
    const data = await pool.query(queryT, [id_user]);

    return data[0][0]["password"];
  } catch (error) {
    console.log("Hubo un error:", error);
  }
};

const getUserCards = async (id_session) => {
  try {
    const queryT = `SELECT * FROM cards WHERE id_user = (SELECT id_user FROM sessions WHERE id_session=?)`;
    const data = await pool.query(queryT, [id_session]);
    return data[0];
  } catch (error) {
    console.log("Hubo un error:", error);
  }
}
const createSession = async (id_user) => {
  try {
    const queryT = "INSERT INTO sessions (id_user) VALUES (?)";
    await pool.query(queryT, [id_user]);
    const query2 = "SELECT id_session FROM sessions WHERE id_user=?"
    const id_session = await pool.query(query2, id_user);
    return id_session[0][0]['id_session'];

  } catch (error) {
    console.log("Hubo un error con la creación de la sesión:", error);
  }
}
const getSession = async (id_session) => {
  try {
    const query = "SELECT * FROM sessions WHERE id_session=?"
    const data = await pool.query(query, id_session);
    if (data[0].length > 0) {
      return true;
    } else {
      return false;
    }

  } catch (error) {
    console.log("Error al obtener sesión", error);
  }
}

module.exports = {
  pool,
  getPassUser,
  getUserCards,
  createSession,
  getSession,
};
