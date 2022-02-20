const Joi = require('joi');
const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const books=[
    {id:1,name:"book1",author:"author1",isbn:"isbn1"},
    {id:2,name:"book2",author:"author2",isbn:"isbn2"},
    {id:3,name:"book3",author:"author3",isbn:"isbn3"},
    {id:4,name:"book3",author:"author3",isbn:"isbn3"},
]

// app.post()
// app.delete()
// app.put()
app.get('/',(req,res)=>{
    res.send('hello pritesh');

});

app.get('/api/books',(req,res)=>{
    res.send(books);
});

app.get('/api/book/:id',(req,res)=>{
   const book =  books.find(c=>c.id === parseInt(req.params.id));

   if (!book) res.status(404).send("this given id not found");
   res.send(book);
}
);

app.post('/api/search',(req,res)=>{
    const { error } = validatesearch(req.body);
    if (error) {
        res.status(204).send(error.details[0].message);
        return;
    }
    const book =  books.find(c=>(c.name === req.body.searchtext) || (c.author === req.body.searchtext) || (c.isbn === req.body.searchtext));
 
    if (!book) return res.status(204).send("this search not found.");

    filter_book=[]

    books.forEach(element => {
        
        if (element.name === req.body.searchtext || element.author === req.body.searchtext || element.isbn === req.body.searchtext){
            filter_book.push(element)

        }
        
      });


    res.send(filter_book);
 }
 );


app.post('/api/books',(req,res)=>{
    const { error } = validateUpdate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const book = {
        id:(books[books.length - 1].id) + 1,
        name:req.body.name,
        author:req.body.author,
        isbn:req.body.isbn,

    };
    books.push(book);
    res.send(book);
});

app.put('/api/books/:id',(req,res)=>{
    //look up the book
    // if not existing , return 404
    const book =  books.find(c=>c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send("this given id not found");
    

    //Validate
    // If invalid, return 400-Bad request
    const { error } = validateUpdate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // update the book
    book.name = req.body.name;
    book.author = req.body.author;
    book.isbn = req.body.isbn;
    res.send(book);

});

app.delete('/api/books/:id',(req,res)=>{
    const book =  books.find(c=>c.id === parseInt(req.params.id));
 
    if (!book) return res.status(404).send("this given id not found");
    const index = books.indexOf(book);
    books.splice(index,1)
    res.send(book);
 }
 );

function validatebook(book){
    const schema=Joi.object({name: Joi.string().alphanum().min(3).max(30).required() })
    const result =schema.validate(book);
    return result;


            }

function validatesearch(book){
    const schema=Joi.object({searchtext: Joi.string().min(1).max(300).required() })
    const result =schema.validate(book);
    return result;


            }    
function validateUpdate(book){
    const schema=Joi.object({name: Joi.string().min(3).max(300).required(),
        author: Joi.string().min(3).max(300).required(),isbn: Joi.string().min(3).max(300).required() })
    const result =schema.validate(book);
    return result;


            }   
            

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`listining on port ${port}....`))