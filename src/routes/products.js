import express from "express";
import db from "../db/database.js";
import {
  createProductSQL,
  deleteProductSQL,
  getAllProductsSQL,
  updateProductSQL,
} from "../repository/products.js";

const router = express.Router();

// GET products
router.get("/", (req, res) => {
  db.all(getAllProductsSQL, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    } else {
      res.send(rows);
    }
  });
});

// POST new product
router.post("/", (req, res) => {
  console.log(req.body);
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).send("Name and price are required");
  } else if (name.length < 5) {
    res.status(400).send("Name length must be higher than 5 characters");
  } else if (price < 4) {
    res.status(400).send("Minimal product price is 4 euros");
  } else {
    db.run(createProductSQL, [name, price], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
      } else {
        const id = this.lastID;
        res.status(201).send({ id, name, price });
      }
    });
  }
});

// PUT update product by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).send("Name and price are required");
  } else if (name.length < 5) {
    res.status(400).send("Name length must be higher than 5 characters");
  } else if (price < 4) {
    res.status(400).send("Minimal product price is 4 euros");
  } else {
    db.run(updateProductSQL, [name, price, id], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
      } else if (this.changes === 0) {
        res.status(404).send("Product not found");
      } else {
        res.status(200).send({ id, name, price });
      }
    });
  }
});

// DELETE product by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run(deleteProductSQL, [id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    } else if (this.changes === 0) {
      res.status(404).send("Product not found");
    } else {
      res.status(204).send();
    }
  });
});

export default router;
