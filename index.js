const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { origin: '*' }
});


httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${PORT}`);
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

let productsHC = [
  {id:1, name: 'Nike', price:100, thumbnail:'http://localhost:8080/public/nike.png'}, 
  {id:2, name:'Adidas', price:200, thumbnail:'http://localhost:8080/public/adidas.png'}, 
  {id:3, name:'Puma', price:300, thumbnail:'http://localhost:8080/public/puma.png'}
  ];

  let chat = [{
    email: 'gonzalojavier19@gmail.com',
    message:'Hola!',
    date: new Date().toLocaleString()
  }];

  
  class Products {
    constructor(products) {
      this.products = products;
    }
    
     
    addOne(product){
      const lastItem = this.products[this.products.length - 1];
      let lastId = 1;
      if (lastItem){
        lastId = lastItem.id + 1;
      }
  
      product.id = lastId;
      this.products.push(product);
      return this.products[this.products.length -1];
    }
  }


app.get('/', (req, res) => {  
  res.render('productsForm');
});

io.on('connection', (socket) => {
  console.log('Un usuario conectado');
  io.sockets.emit('products', productsHC);
  io.sockets.emit('chat', chat);

  socket.on('newMessage', (msg) => {
    chat.push(msg);
    io.sockets.emit('chat', chat);

  });

  socket.on('addProduct', (data) => {
    const products = new Products(productsHC);
    products.addOne(data);
    io.sockets.emit('products', productsHC);

  });
});






