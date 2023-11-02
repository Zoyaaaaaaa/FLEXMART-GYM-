
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const Product=require("./models/products.js");
const MONGO_URL="mongodb://127.0.0.1:27017/gym";
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override');
const mongoose=require("mongoose");
//const Rating=require("./models/rating.js");


main().then(()=>{
    console.log("MongoDb connected successfully!");
}).catch(err=>{
console.log(err);
});
 async function main(){
    await mongoose.connect(MONGO_URL);
 }
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let blogs = [
    {
        id: uuidv4(),
        username: "Zaidan",
        title:"fitness",
        content: "I worked out for 1 hour",
    },
    {
        id: uuidv4(),
        username: " Jeremiah",
        title:"fitness",
        content: "I bought gym equipment",
    },
    {
        id: uuidv4(),
        username: "Steven",
        title:"fitness",
        content: "I go to the gym every day",
    },
];
app.get("/all",async(req,res)=>{
    const allpdts= await Product.find({});
res.render("allpdts.ejs",{allpdts});
});
app.post("/all", async (req, res) => {
    const newProduct = new Product(req.body); 

    try {
        await newProduct.save(); 
        res.redirect("/all");
    } catch (error) {
        console.error(error);
    }
});
//
//add pstds
app.get("/pdt/new",async(req,res)=>{
   
    res.render("create.ejs");
  });

//show each products
app.get("/pdt/:id",async(req,res)=>{
  let{id}=req.params;
  const pdt=await Product.findById(id);
  res.render("see.ejs",{pdt});
});
//cart
const cart = []; 
app.get('/cart', (req, res) => {
    const productId = req.query.id;

  
    const existingProduct = cart.find(product => product.id === productId);

    if (existingProduct) {
        // If the product is already in the cart, increase the quantity by 1
        existingProduct.quantity += 1;
    } else {
        // If the product is not in the cart, add it with quantity 1
        const product = {
            id: req.query.id,
            name: req.query.name,
            price: parseFloat(req.query.price),
            image: req.query.image,
            quantity: 1
        };
        cart.push(product);
    }

    // Render the cart page and pass the cart array to the template
    res.render('cart', { cart });
});

//wishlist
const wishlist = [];
// Handle adding a product to the wishlist
app.get('/wishlist', (req, res) => {
    const productId = req.query.id;
    const existingProduct = wishlist.find(product => product.id === productId);

    if (existingProduct) {
        // If the product is already in the wishlist, increase the quantity by 1
        existingProduct.quantity += 1;
    } else {
        // If the product is not in the wishlist, add it with quantity 1
        const product = {
            id: req.query.id,
            name: req.query.name,
            price: parseFloat(req.query.price),
            image: req.query.image,
            quantity: 1
        };
        wishlist.push(product);
    }

    // Render the wishlist page and pass the wishlist array to the template
    res.render('wishlist', { wishlist });
});



//review
app.post("/all/:id/rating",async(req,res)=>{
    let pdt=await Product.findById(req.params.id);
    const newRating = new Rating({
       comment: req.body.rating.comment,
       rat: req.body.rating.rating,
     });
    pdt.rating.push(newRating);
    await newRating.save();
    await pdt.save();
    console.log("new rev saved");
  
  res.redirect(`/pdt/${pdt._id}`);
   });
app.get("/blogs", (req, res) => {
    res.render("index.ejs", { blogs: blogs });
});

app.post("/blogs", (req, res) => {
    let { username,title, content } = req.body;
    let id = uuidv4();
    blogs.push({ id, username, title,content });
    res.redirect("/blogs");
});

app.get("/blogs/new", (req, res) => {
    res.render("new.ejs");
});

app.get("/blogs/:id", (req, res) => {
    let { id } = req.params;
    let blog = blogs.find((p) => id === p.id);
    res.render("details.ejs", { blog });
});
 
app.patch("/blogs/:id",(req,res)=>{
let {id}=req.params;
let newtitle=req.body.title;
let newContent=req.body.content;
let blog = blogs.find((p) => id === p.id);
blog.title=newtitle;
blog.content=newContent;
res.redirect("/blogs");
});

app.get("/blogs/:id/edit", (req, res) => {
    let { id } = req.params;
    let blog = blogs.find((p) => id === p.id);
    res.render("edit.ejs", { blog });
    res.redirect("/blogs");
});

app.delete("/blogs/:id",(req,res)=>{
    let { id } = req.params;
    blogs= blogs.filter((p) => id !== p.id);
    res.redirect("/blogs");
  
});
app.get("/testproduct",async(req,res)=>{
let samplep=new Product({
    name:"Skipping Rope",
    description:"used for skipping",
    image:"https://gymmanufacturer.in/wp-content/uploads/2019/07/Skipping-Rope.jpg",
    price:200,
    type:"cardio",
    availability:"10 left",
    review:"Good quality",

});
 await samplep.save();
 console.log("sample was saved");
 res.send("successfully saved");
})
app.get("/lander", (req, res) => {
    res.render("lander.ejs");
});
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});
app.get("/home", (req, res) => {
    res.render("home.ejs");
});
app.get("/bmi", (req, res) => {
    res.render("calculator.ejs");
});
app.get("/payment", (req, res) => {
    res.render("payment.ejs");
});
app.get("/checkout", (req, res) => {
    res.render("checkout.ejs");
});
app.get("/pay", (req, res) => {
    res.render("pay.ejs");
    res.redirect("/thanks")
});
app.get("/exit", (req, res) => {
    res.render("exit.ejs");
});
app.get("/thanks", (req, res) => {
    res.render("thanks.ejs");
});
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
app.get("/equipments",(req,res)=>{
res.render("equipments.ejs");
});
app.get("/resources",(req,res)=>{
    res.render("resources.ejs");
    });
 
    app.get("/jiapro",(req,res)=>{
        res.render("jiapro.ejs");
        });
       
    app.get("/sidpro",(req,res)=>{
        res.render("sidpro.ejs");
        });
      
    
        
        app.use(express.json()); 
        app.get('/description', (req, res) => {
            const product = "Nike Men's Grey Jersey"; 
            res.render('description.ejs', { pageTitle: 'Product Description', product: product });
        });
        app.get('/protein', (req, res) => {
            const product = "Bigmuscles Protein Powder"; 
            res.render('protein', { pageTitle: 'Product Description', product: product });
        });
        
        app.get('/dumbell', (req, res) => {
            const product = "Dumbell"; 
            res.render('dumbell.ejs', { pageTitle: 'Product Description', product: product });
        });
        
      
        
const defaultCredentials = {
    username: 'MPR@gmail.com',
    password: 'MPR12345',
};



app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === defaultCredentials.username && password === defaultCredentials.password) {
       
    //   res.send("Successfully log in!");
    res.redirect("/home");
    //redirect from here to client page
    } else {
      
        res.status(401).send('Login failed!'); 
    }
});
