let books = [];
const RENDER_EVENT = "RENDER_EVENT";
const STORAGE_KEY = "BOOKS_APPS";
const SAVED_EVENT = "saved-book";
const DELETE_EVENT = "delete-book";
let searchFlag = false;
let submitFlag = false;
console.log("BOOKSHELF APPS");

function makeBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const id = +new Date();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const book = makeBook(id, title, author, year, isComplete);
  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));
  updateDataToStorage();
}

function renderBook(book) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = "Judul Buku: " + book.title;

  const textAuthor = document.createElement("p");
  textAuthor.classList.add("author");
  textAuthor.innerText = "Penulis: " + book.author;

  const textYear = document.createElement("p");
  textYear.classList.add("year");
  textYear.innerText = "Tahun: " + book.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${book.id}`);

  if (book.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(book.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(book.id);
      document.dispatchEvent(new Event(DELETE_EVENT));
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button", "item");
    checkButton.addEventListener("click", function () {
      addBookToCompleted(book.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(book.id);
      document.dispatchEvent(new Event(DELETE_EVENT));
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  updateDataToStorage();
}

function removeBookFromCompleted(bookId) {
  const bookPosition = findBookIndex(bookId);
  if (bookPosition === -1) return;
  books.splice(bookPosition, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  updateDataToStorage();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  updateDataToStorage();
}

function updateDataToStorage() {
  if (typeof Storage !== undefined) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(SAVED_EVENT));
  } else {
    alert("Browser kamu tidak mendukung local storage");
  }
}

function loadDataFromStorage() {
  const dataStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataStorage);

  if (data !== null) {
    books = data;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput.value.toLowerCase();
  const bookList = document.getElementById("bookList");
  const bookItem = bookList.querySelectorAll(".item");

  bookItem.forEach(function (book) {
    const bookTitle = book.querySelector("h3").innerText.toLowerCase();
    if (bookTitle.indexOf(searchValue) != -1) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}

const clearButton = document.getElementById("bookClear");
clearButton.addEventListener("click", function () {
  localStorage.removeItem(STORAGE_KEY);
  if (books.length === -1) return;
  books.splice(0, books.length);
  document.dispatchEvent(new Event(RENDER_EVENT));
  submitFlag = true;
  searchFlag = true;
  console.log(`submitflag ${submitFlag}`);
  console.log(`searchtflag ${submitFlag}`);
  updateDataToStorage();
});

const searchSubmit = document.getElementById("searchSubmit");
searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();
  if (searchFlag === false) {
    searchFlag = true;
  } else if (searchFlag === true) {
    searchFlag = false;
  }
  console.log(`searchFlag ${searchFlag}`);
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(DELETE_EVENT, function () {
  if (localStorage.getItem(STORAGE_KEY) !== null) {
    alert("Data berhasil dihapus");
  } else {
    alert("Data tidak ditemukan");
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookSubmit");
  submitForm.addEventListener("click", function (event) {
    event.preventDefault();
    addBook();
  });
  if (typeof Storage !== undefined) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooksList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBooksList = document.getElementById("completeBookshelfList");
  uncompletedBooksList.innerHTML = "";
  completedBooksList.innerHTML = "";
  if (searchFlag === true) {
    console.log(`search-true ${searchFlag}`);
    const searchInput = document.getElementById("searchBookTitle");
    const filter = searchInput.value.toLowerCase();
    const filterBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(filter);
    });
    console.log(filterBooks);
    for (const book of filterBooks) {
      const bookElement = renderBook(book);
      if (book.isComplete) {
        completedBooksList.append(bookElement);
      } else {
        uncompletedBooksList.append(bookElement);
      }
    }
  }
  if (searchFlag === false) {
    console.log(`search-false ${searchFlag}`);
    for (const book of books) {
      const bookElement = renderBook(book);
      if (book.isComplete) {
        completedBooksList.append(bookElement);
      } else {
        uncompletedBooksList.append(bookElement);
      }
    }
  }
});
