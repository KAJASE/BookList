class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
  const list = document.getElementById('book-list');
  //Create tr element
  const row = document.createElement('tr');
  //Insert cols
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
  list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if(target.className === 'delete'){
    target.parentElement.parentElement.remove();
  }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//Local Storage Class
class Store {
  static getBook(){
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBook() {
    const books = Store.getBook();

    books.forEach(function(book){
      const ui = new UI;

      //add book to UI
      ui.addBookToList(book);
    });
      
  }
  

  static addBook(book) {
    const books = Store.getBook();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBook();

    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });
    
    localStorage.setItem('books', JSON.stringify(books));
  }
}


//Dom load event
document.addEventListener('DOMContentLoaded', Store.displayBook);

document.getElementById('book-form').addEventListener('submit', function(e){
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value
  
  const book = new Book(title, author, isbn);

  const ui = new UI();

  
  //Validate
  if(title === '' || author === '' || isbn === ''){
    ui.showAlert('Please fill in all fields', 'error');
  }else{
    ui.addBookToList(book);

    //Add to LS
    Store.addBook(book);
    
    ui.showAlert('Book added!', 'success');
    //Clear fields
    ui.clearFields();
    console.log(ui);
    
  }
  e.preventDefault();
});

//Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
  const ui = new UI();
  ui.deleteBook(e.target);

  //Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert('Item deleted.', 'success');
  e.preventDefault();
})