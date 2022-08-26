const socket = io();

socket.on('connection', () =>{
    console.log('estas conectado')
});

let productos = [];
let chat = [];

socket.on('products', (data)=>{
    productos = data;
    let htmlToRender = '';
    console.log(data);
    for (let i=0; i < productos.length; i++){
        htmlToRender = htmlToRender +`
        <tr>       
            <td> ${productos[i].id}</td>
            <td> ${productos[i].name}</td>
            <td> $${productos[i].price}</td>
            <td ><img src=${productos[i].thumbnail} style="width: 100px; height: 100px;"></img></td>
        </tr>
        `
    }

    document.querySelector('#productosSocket').innerHTML = htmlToRender;

})

socket.on('chat', (data)=>{
    chat = data;
    let htmlToRender = ''
    for (let i=0; i < chat.length; i++){
        htmlToRender = htmlToRender +`
        <div style="display: flex">
        <p style="color:blue">${chat[i].email}:</p>
        <p style="color:brown">[${chat[i].date}]:</p>
        <p style="color:green">${chat[i].message}</p> 
        </div>      
        `
    }    
    document.querySelector('#chat').innerHTML = htmlToRender;


})

function addMessage(mensaje){
    let messageToAdd = {
        email: mensaje.email.value,
        message: mensaje.mensaje.value,
        date: new Date().toLocaleString()
       
        
    }
    
    socket.emit('newMessage', messageToAdd)
    document.getElementById('mensaje').value='';

}

function addProduct(producto){
    
    let productToAdd = {
        name: producto.name.value,
        price: producto.price.value,
        thumbnail: producto.url_image.value
    }
    socket.emit('addProduct', productToAdd)
    document.querySelector('#productForm').reset();

}