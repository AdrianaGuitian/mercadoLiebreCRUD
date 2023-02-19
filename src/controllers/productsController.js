const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		return res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const { id } = req.params;
		const product = products.find(product => product.id === +id)
		return res.render('detail', {
			...product,
			toThousand,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic

		return res.render('product-create-form')

	},

	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const { name, price, discount, category, description } = req.body;

		const newProduct = {
			id: products[products.length - 1].id + 1,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category: category,
			description: description.trim(),
			image: req.file ? req.file.filename : null,
		};
		products.push(newProduct);

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 3), 'utf-8');
		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic

		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const { id } = req.params;

		const productToEdit = products.find((product) => product.id === +id);
		return res.render('product-edit-form', {
			...productToEdit,
			toThousand
		});
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const { name, price, discount, category, description } = req.body;

		const id = +req.params.id

		const product = products.find((product) => product.id === +id);

		const productUpdated = {
			id: +id,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category: category,
			description: description.trim(),
			image: req.file ? req.file.filename : product.image
		}
		const productsModified = products.map(product => {
			if (product.id === +id) {
				return productUpdated
			}
			return product
		});

		fs.writeFileSync(productsFilePath, JSON.stringify(productsModified, null, 3), 'utf-8');

		return res.redirect('/products/detail/' + id)
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
		const { id } = req.params;
		const productsModified = products.filter(product => product.id !== +id);

		fs.writeFileSync(productsFilePath, JSON.stringify(productsModified, null, 3), 'utf-8')

		return res.redirect('/products')
	},
};

module.exports = controller;