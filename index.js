const express = require('express');
const db = require('./config/db/db');
const Inventory = require('./models/inventoryModel');
const upload = require('./middleware/multer');
const app = express();

db()

const PORT = 3001;
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.get('/', (req, res) => {
    console.log("Index page is loading.....");
    res.render('index')
})

app.get('/view-inventory', async(req, res) => {
   try{
        const products = await Inventory.find();
        console.log("View Inventory Page Loaded");
        console.log(products);
        res.render('view-product', {products})
   }
   catch(err){
        console.error(err);
   }

})

app.get('/add-product', (req, res) => {
    res.render('add-product')
})

app.post('/add-product', upload.single('image'), async(req, res) => {

     try {

        const product = await Inventory.create({
            name: req.body.name,
            description: req.body.description,
            image: '/uploads/' + req.file.filename,
            price: req.body.price,
            quantity: req.body.quantity
        });

        console.log("Product Added Successfully" , product);
        res.redirect('/view-inventory');

    } catch(err) {
        console.log("Error in adding product =====>", err);
    }
})

app.get('/edit-product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Inventory.findById(id);
        
        console.log("Edit Product loaded successfully.");
        console.log("Product Found:", product);
        res.render('edit-product', {product});
    } catch(err) {
        console.log("Error loading edit product page:", err);
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
                image: req.body.image,
                price: req.body.price,
                quantity: req.body.quantity
            },
            { new: true }
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