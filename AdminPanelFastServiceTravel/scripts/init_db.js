// db.createUser(
//         {
//             user: "safouan",
//             pwd: "Safouan1559&",
//             roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
//         }
// );

db.auth('safouan', 'Safouan1559&')

db = db.getSiblingDB('taachira')

db.createUser({
  user: 'safouan',
  pwd: 'Safouan1559',
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
});