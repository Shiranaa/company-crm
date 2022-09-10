const database = require("./database");

async function getCustomers(req, res) {
  const sql = "SELECT * FROM customers";
  const result = await database.query(sql);
  const customers = result[0];
  res.json(customers);
}

async function addCustomer(req, res) {
  const { name, email, phone } = req.body;
  const sql = "INSERT INTO customers(name,email,phone) VALUES(?,?,?)";
  const result = await database.query(sql, [name, email, phone]);
  res.json(result);
}

async function editCustomer(req, res) {
  const { id, name, email, phone } = req.body;
  const sql = "UPDATE customers SET name=?, email=?, phone=? where id=?";
  const result = await database.query(sql, [name, email, phone, parseInt(id)]);
  res.json(result);
}

async function deleteCustomer(req, res) {
  const { id } = req.params;
  const sql = "DELETE FROM customers where id=?";
  const result = await database.query(sql, [parseInt(id)]);
  res.json(result);
}

module.exports = { getCustomers, addCustomer, editCustomer, deleteCustomer };
