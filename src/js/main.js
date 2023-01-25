// const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
const RENDER_EVENT = "RENDER_EVENT";

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
  //   updateDataToStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function renderBook(book) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = book.title;

  const textAuthor = document.createElement("p");
  textAuthor.classList.add("author");
  textAuthor.innerText = book.author;

  const textYear = document.createElement("p");
  textYear.classList.add("year");
  textYear.innerText = book.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${book.id}`);

  if (book.isComplete) {
    // container.append(createUndoButton(), createTrashButton());
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      // undoBookFromCompleted(event.target.parentElement.id);
      undoBookFromCompleted(book.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      // removeBookFromCompleted(event.target.parentElement.id);
      removeBookFromCompleted(book.id);
    });

    container.append(undoButton, trashButton);
  } else {
    // container.append(createCheckButton());
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button", "item");
    checkButton.addEventListener("click", function () {
      // addBookToCompleted(event.target.parentElement.id);
      addBookToCompleted(book.id);
    });

    container.append(checkButton);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromCompleted(bookId) {
  const bookPosition = findBookIndex(bookId);
  if (bookPosition === -1) return;
  books.splice(bookPosition, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

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
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  //   document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooksList = document.getElementById(
    "incompleteBookshelfList"
  );

  const completedBooksList = document.getElementById("completeBookshelfList");

  uncompletedBooksList.innerHTML = "";
  completedBooksList.innerHTML = "";

  for (const book of books) {
    const bookElement = renderBook(book);
    if (book.isComplete) {
      completedBooksList.append(bookElement);
    } else {
      uncompletedBooksList.append(bookElement);
    }
  }
});

