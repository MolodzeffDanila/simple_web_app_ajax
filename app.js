const express = require('express');
const app = express();
const port = 3000;
const body_parser = require('body-parser')
var name="";
var password="";


app.set("view engine", "pug");
app.set("views", "./view");
app.use('/static',express.static('static'));
app.use(express.json());
app.use(express.urlencoded());

let library = require('./json/books.json');

app.get('/', (req, res) => {
    res.render("index",{
        text: "TEXT TEXT TEXT"
    });
});

app.get('/book_list', (req,res) => {
    res.render("list",{
       books: library,
        user: name,
        password: password
    });
});

app.get('/book/:title', (req,res) => {
    let title = req.params.title;
    let current_book="";
    for(let elem of library){
        if(elem.title===title){
            current_book = elem;
        }
    }
    res.render("book",{
        book: current_book,
        user: name,
        password: password
    });
});

app.post('/add', (req, res) => {
    let new_book = req.body;
    new_book.id = library[library.length - 1].id+1;
    new_book.user ="";
    new_book.date_of_taking="";
    new_book.date_of_return="";
    new_book.description=req.body.description;
    library.push(new_book);
    res.redirect('/book_list');
})

app.post('/change/:id', (req, res) => {
    let id = req.params.id;
    for(let key of library){
        if(key.id === +id){
            key.title = req.body.title;
            key.year = req.body.year;
            key.author = req.body.author;
            key.description = req.body.description;
        }
    }
    res.redirect('/book_list');
})

app.post('/login',(req,res) => {
    name = req.body.nick;
    password = req.body.password;
    res.redirect('/book_list');
})

app.post('/take/:id',(req,res)=>{
    let id = req.params.id;
    for(let key of library){
        if(key.id === +id){
            let now = new Date();
            key.user = req.body.user;
            key.date_of_taking = date_parse(now);
            now.setHours(now.getHours() + 30*24);
            key.date_of_return = date_parse(now);
        }
    }
    res.redirect('/book_list');
})

app.get('/return/:id',(req,res)=>{
    let id = req.params.id;
    for(let key of library){
        if(key.id === +id){
            key.date_of_taking="";
            key.user="";
            key.date_of_return="";
        }
    }
    res.redirect('/book_list');
})

app.get('/remove/:id',(req,res)=>{
    let id = req.params.id;
    for(let key of library){
        if(key.id === +id){
            library.splice(library.indexOf(key), 1);
        }
    }
    res.redirect('/book_list');
})

app.get('/filter/:id',(req,res)=>{
    let books=[];
    let id = req.params.id;
    switch(id){
        case "01":
            for(let book of library){
                books.push({"id" : book.id, 'status' : true});
            }
            res.end(JSON.stringify(books));
            break;
        case "02":
            for(let book of library){
                if(book.date_of_taking===""){
                    books.push({"id" : book.id, 'status' : true});
                }else{
                    books.push({"id" : book.id, 'status' : false});
                }
            }
            res.end(JSON.stringify(books));
            break;
        case "03":
            for(let book of library){
                if(book.date_of_taking !==""){
                    books.push({"id" : book.id, 'status' : true});
                }else{
                    books.push({"id" : book.id, 'status' : false});
                }
            }
            res.end(JSON.stringify(books));
            break;
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

function date_parse(date){
    let date_str="";
    let day = "";
    let month = "";
    if(date.getDate()<10){
        day = "0" + date.getDate();
    }else{
        day = date.getDate();
    }
    if(date.getMonth()+1<10){
        month = "0"+ date.getMonth()+1;
    }else {
        month = date.getMonth()+1;
    }
    date_str = day  + "-" + month + "-" + date.getFullYear();
    return date_str;
}

