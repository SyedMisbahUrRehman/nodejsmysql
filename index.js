const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MySQL database using Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

// Define Product model without timestamps
const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false // Remove timestamps
  });
  

// Synchronize model with database
sequelize.sync()
  .then(() => {
    console.log('Database & tables synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });


  // Create a new product
app.post('/products', async (req, res) => {
    try {
      const { name, price, quantity } = req.body;
  
      if (!name || !price || !quantity) {
        return res.status(400).json({ error: 'Name, price, and quantity are required' });
      }
  
      const product = await Product.create({ name, price, quantity });
      res.status(201).json(product);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Retrieve all products
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      console.error('Error retrieving products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Retrieve a single product
  app.get('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(product);
    } catch (err) {
      console.error('Error retrieving product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update a product
  app.put('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, price, quantity } = req.body;
  
      const product = await Product.findByPk(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      await Product.update({ name, price, quantity }, { where: { id: productId } });
  
      res.json({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete a product
  app.delete('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      await Product.destroy({ where: { id: productId } });
  
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
