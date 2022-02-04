const express = require("express");
const hbs = require("hbs");
const app = express();

const mongoose = require("mongoose");
const Product = require("./models/Product.model");

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static('public'));


// connect to DB
mongoose
    .connect('mongodb://localhost/ecommerceApp')
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err));


app.get("/", function (req, res, next) {
    Product.find()
        .then((products) => {
            res.render("home", { products: products });
        })
        .catch(error => console.log("error getting data from DB", error));
});


app.get("/contact", function (req, res, next) {
    res.render("contact");
});


app.get("/search", function (req, res, next) {
    
    let {maxPrice} = req.query;
    maxPrice = Number(maxPrice);

    Product.find({ price: {$lte: maxPrice} })
        .then(productsFromDB => {
            res.render("search", {products: productsFromDB});
        })
        .catch(error => console.log("error getting data from DB", error));
});



app.get("/products/:productTitle/:productId", function (req, res, next) {
    Product.findById(req.params.productId)
        .then(productFromDB => {
            res.render("product", productFromDB);
        })
        .catch(error => console.log("error getting data from DB", error));
})


app.listen(3000, () => { console.log("server listening...."); });