import React, { Component } from 'react';
import axios from 'axios';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';

class App extends Component {
  state = {
    books: [],
    popup:{
      show: false,
      id: null
    },

    newBookData: {
      name: '',
      author: '',
      isbn: ''
    },

    editBookData: {
      id: '',
      name: '',
      author: '',
      isbn: ''
    },
    searchData:{      
      searchtext: ''
    },
    search_text: false,

    newBookModal: false,
    editBookModal: false
  }
  componentWillMount() {
    this._refreshBooks();
  }
  toggleNewBookModal() {
    this.setState({
      newBookModal: ! this.state.newBookModal
    });
  }
  toggleEditBookModal() {
    this.setState({
      editBookModal: ! this.state.editBookModal
    });
  }
  addBook() {
    axios.post('http://localhost:3000/api/books', this.state.newBookData).then((response) => {
      let { books } = this.state;

      books.push(response.data);

      this.setState({ books, newBookModal: false, newBookData: {
        name: '',
        author: '',
        isbn: ''
      }});
    });
  }
  updateBook() {
    let { name, author, isbn } = this.state.editBookData;

    axios.put('http://localhost:3000/api/books/' + this.state.editBookData.id, {
      name, author, isbn
    }).then((response) => {
      this._refreshBooks();

      this.setState({
        editBookModal: false, editBookData: { id: '', name: '', author: '', isbn: '' }
      })
    });
  }
  editBook(id, name, author, isbn) {
    this.setState({
      editBookData: { id, name, author, isbn }, editBookModal: ! this.state.editBookModal
    });
  }
  deleteBook(id) {
    axios.delete('http://localhost:3000/api/books/' + id).then((response) => {
      this._refreshBooks();
    });
  }
  _refreshBooks() {
    axios.get('http://localhost:3000/api/books').then((response) => {
      console.log("response data",response);
      this.setState({
        books: response.data
      })
    });
  }

  handleChange(event) {    
this.searchBook();
   }



  searchBook(text_data) {
    const data_val = {"searchtext":""}
    data_val.searchtext = text_data;
    console.log('data_val',data_val);
    
      axios.post('http://localhost:3000/api/search',data_val).then((response) => {
      console.log("response data1",response);
      if (response.data === ""){
        this.setState({
          books: [],
          search_text: false,
          searchtext: ''
        })
        
      }
      else{
        this.setState({
          books: response.data,
          search_text: false,
          searchtext: ''
        })

      }

      this.setState({
        search_text: false,
        searchtext: ''
      })

        

   
    
    });
      
    
    
  }

  render() {
    let books = this.state.books.map((book) => {
      return (
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.name}</td>
          <td>{book.author}</td>
          <td>{book.isbn}</td>
          <td>
            <Button color="success" size="sm" className="mx-2" onClick={this.editBook.bind(this, book.id, book.name, book.author,book.isbn)}>Edit</Button>
            <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, book.id)}>Delete</Button>
          </td>
        </tr>
      )
    });
    return (
      
      <div className="App container">

      <h1>Books App</h1>
      
        <div>
     

<Button  color="success"  onClick={this._refreshBooks.bind(this)} >All Books</Button>
<Button className="mx-2" color="warning" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
        </div>

      
      <FormGroup>
        <Label for="search">
          Search
        </Label>
        <Input
          id="search"
          name="search"
          placeholder="search book here"
          type="search"
          value={this.state.searchData.searchtext}
          onChange={(e) => {
            
            let { searchData } = this.state;
            let { search_text } = this.state;

            searchData.searchtext = e.target.value;
            console.log("eval",e.target.value);
            search_text = true;

            this.setState({ searchData});
            this.setState({ search_text});
            this.searchBook(e.target.value);
            
          }}
        />
      </FormGroup>
      

      <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input id="name" required="required" value={this.state.newBookData.name}  onChange={(e) => {
              let { newBookData } = this.state;

              newBookData.name = e.target.value;

              this.setState({ newBookData });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="author">Author</Label>
            <Input id="author" required="required" value={this.state.newBookData.author} onChange={(e) => {
              let { newBookData } = this.state;

              newBookData.author = e.target.value;

              this.setState({ newBookData });
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="isbn">ISBN</Label>
            <Input id="isbn" required="required" value={this.state.newBookData.isbn} onChange={(e) => {
              let { newBookData } = this.state;

              newBookData.isbn = e.target.value;

              this.setState({ newBookData });
            }} />
          </FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
          <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
        <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a new book</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input id="name" value={this.state.editBookData.name} onChange={(e) => {
              let { editBookData } = this.state;

              editBookData.name = e.target.value;

              this.setState({ editBookData });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="author">Author</Label>
            <Input id="author" value={this.state.editBookData.author} onChange={(e) => {
              let { editBookData } = this.state;

              editBookData.author = e.target.value;

              this.setState({ editBookData });
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="isbn">ISBN</Label>
            <Input id="isbn" value={this.state.editBookData.isbn} onChange={(e) => {
              let { editBookData } = this.state;

              editBookData.isbn = e.target.value;

              this.setState({ editBookData });
            }} />
          </FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateBook.bind(this)}>Update Book</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>


        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;