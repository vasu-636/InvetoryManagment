const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const PORT = 3001;
app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded())
app.use(express.static('public'))

let products = [];

app.get('/', (req, res) => {
    console.log("Index page is loading.....");
    res.render('index')
})

app.get('/view-inventory', (req, res) => {
    console.log("View Inventory Page Loaded");
    res.render('view-product', {
        products: products
    })

})

app.get('/add-product', (req, res) => {
    console.log("Add product page loaded");
    res.render('add-product')
})


app.post('/add-product', (req, res) => {
    const newProduct = {
        id: Date.now(),
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        quantity: req.body.quantity
    };

    products.push(newProduct);
    console.log(products);
    res.redirect('/view-inventory')
})

app.get('/edit-product/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id == id);
    if (!product) {
        return console.log("Product Not Found");;
    }
    console.log("Edit Product laoded successfully.");
    console.log("Product Found:", product);
    res.render('edit-product', {product});
})

app.post('/edit-product/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id == id);
    
    if (productIndex === -1) {
        return console.log("Product Not Found ");;
    }
    
    products[productIndex] = {
        id: parseInt(id),
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        quantity: req.body.quantity
    };
    
    console.log("Product Updated:", products[productIndex]);
    res.redirect('/view-inventory');
})

app.get('/delete-product/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id == id);
    
    if (productIndex === -1) {
        return console.log("Failed to delete product...");;
    }
    
    const deletedProduct = products.splice(productIndex, 1);
    console.log("Product Deleted Sucessfully .");
    console.log("Product Deleted:", deletedProduct);
    res.redirect('/view-inventory');
})

app.get('/product-blog/:id',(req,res)=>{
    const {id} = req.params;
    let blogProduct = products.find(p => p.id == id);

    console.log("Produt Blog Page Loaded successfully !");
    console.log("Blog Product : ", blogProduct);
    res.render('product-blog',{blogProduct});
})

app.listen(PORT, () => {
    console.log(`Server Running on : http://localhost:${PORT}`);
})