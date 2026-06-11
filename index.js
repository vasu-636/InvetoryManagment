const express = require('express');
const bodyparser = require('body-parser');
const db = require('./config/db/db');
const Inventory = require('./models/inventoryModel');
const app = express();

db()

const PORT = 3001;
app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded())
app.use(express.static('public'))

let products = [];

app.get('/', (req, res) => {
    console.log("Index page is loading.....");
    res.render('index')
})

app.get('/view-inventory', async(req, res) => {
   try{
        const products = await Inventory.find();
        console.log("View Inventory Page Loaded");
        console.log(products);
        res.render('view-product', {
        products
    })
   }
   catch(err){
        console.error(error);
        res.status(500).send("Error loading products");
   }

})

app.get('/add-product', (req, res) => {
    console.log("Add product page loaded");
    res.render('add-product')
})


app.post('/add-product', async(req, res) => {
    // const newProduct = {
    //     id: Date.now(),
    //     name: req.body.name,
    //     description: req.body.description,
    //     imageUrl: req.body.imageUrl,
    //     price: req.body.price,
    //     quantity: req.body.quantity
    // };

    // products.push(newProduct);
    // console.log(products);
     try {
        const product = await Inventory.create({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            quantity: req.body.quantity
        });

        console.log("Product Added Successfully" , product);
        res.redirect('/view-inventory');

    }catch(err){
        console.log("Error in adding product =====>", err);
    }
})

app.get('/edit-product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Inventory.findById(id);
        
        if (!product) {
            return res.status(404).send("Product Not Found");
        }
        
        console.log("Edit Product loaded successfully.");
        console.log("Product Found:", product);
        res.render('edit-product', {product});
    } catch(err) {
        console.log("Error loading edit product page:", err);
        res.status(500).send("Error loading product");
    }
})

app.post('/edit-product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        
        const updatedProduct = await Inventory.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                price: req.body.price,
                quantity: req.body.quantity
            },
        );
        
        console.log("Product Updated Successfully:", updatedProduct);
        res.redirect('/view-inventory');
    } catch(err) {
        console.log("Error updating product:", err);
        res.status(500).send("Error updating product");
    }
})

app.get('/delete-product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        
        const deletedProduct = await Inventory.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).send("Product Not Found");
        }
        
        console.log("Product Deleted Successfully.");
        console.log("Product Deleted:", deletedProduct);
        res.redirect('/view-inventory');
    } catch(err) {
        console.log("Error deleting product:", err);
        res.status(500).send("Error deleting product");
    }
})

app.get('/product-blog/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const blogProduct = await Inventory.findById(id);

        console.log("Product Blog Page Loaded successfully !");
        console.log("Blog Product : ", blogProduct);
        res.render('product-blog',{blogProduct});
    } catch(err) {
        console.log("Error loading product blog:", err);
        res.status(500).send("Error loading product");
    }
})

app.listen(PORT, () => {
    console.log(`Server Running on : http://localhost:${PORT}`);
})