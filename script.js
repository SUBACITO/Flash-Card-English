// script.js

// Variables to track flashcards and current index
let flashcards = [];
let currentIndex = 0;

document.getElementById('word-form').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const word = document.getElementById('word').value;
    const meaning = document.getElementById('meaning').value;
  
    if (word && meaning) {
      addFlashcard(word, meaning);
      document.getElementById('word-form').reset();
    }
  });
  
  
  
  // Add new flashcards to the array
  function addFlashcard(word, meaning) {
    flashcards.push({ word, meaning });
    saveToLocalStorage(); // Save the updated flashcards array to localStorage

    const flashcardsContainer = document.getElementById('flashcards-container');
    const flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');

    const card = document.createElement('div');
    card.classList.add('card');
    card.addEventListener('click', () => card.classList.toggle('flip'));

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-side', 'card-front');
    cardFront.textContent = word;

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-side', 'card-back');
    cardBack.textContent = meaning;

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    flashcard.appendChild(card);
    flashcardsContainer.appendChild(flashcard);
    }

    // Save flashcards to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  
  // Test Mode Logic
  const modal = document.getElementById('test-modal');
  const modalCard = document.getElementById('modal-card');
  const nextButton = document.getElementById('next-card-btn');
  const prevButton = document.getElementById('prev-card-btn');
  const card_per_total = document.getElementById('card-per-total');
  const closeButton = document.getElementById('close-modal');
  
  // Open Test Mode
  document.getElementById('start-test-btn').addEventListener('click', () => {
    if (flashcards.length === 0) {
      alert("No flashcards to test. Please add some first!");
      return;
    }
    currentIndex = 0;
    showFlashcard();
    modal.style.display = 'flex';
  });
  
  // Close Modal
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Show Flashcard in Modal
  function showFlashcard() {
    const cardData = flashcards[currentIndex];
    const front = modalCard.querySelector('.card-front');
    const back = modalCard.querySelector('.card-back');
  
    front.textContent = cardData.word;
    back.textContent = cardData.meaning;
  
    modalCard.classList.remove('flip');

    card_per_total.innerHTML = (currentIndex+1) +"/" + flashcards.length;
  }
  
  // Next Flashcard
  nextButton.addEventListener('click', () => {
    currentIndex++;
    card_per_total.innerHTML = (currentIndex+1) +"/" + flashcards.length;
    if (currentIndex >= flashcards.length) {
      alert("You've completed the test!");
      modal.style.display = 'none';
    } else {
      showFlashcard();
    }
  });
  
  prevButton.addEventListener('click', () => {
    if(currentIndex <= 0) return;
    
    currentIndex--;
    card_per_total.innerHTML = (currentIndex+1) +"/" + flashcards.length;
    if (currentIndex >= flashcards.length) {
      alert("You've completed the test!");
      modal.style.display = 'none';
    } else {
      showFlashcard();
    }
  });
  
  // Flip Card in Modal
  modalCard.addEventListener('click', () => {
    modalCard.classList.toggle('flip');
  });


  function loadFromLocalStorage() {
    const storedFlashcards = localStorage.getItem('flashcards');
    if (storedFlashcards) {
        flashcards = JSON.parse(storedFlashcards);
        flashcards.forEach(card => addFlashcardToUI(card.word, card.meaning));
    }
}

// Add flashcards to the UI without pushing to the array
function addFlashcardToUI(word, meaning) {
    const flashcardsContainer = document.getElementById('flashcards-container');
    const flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');

    const card = document.createElement('div');
    card.classList.add('card');
    card.addEventListener('click', () => card.classList.toggle('flip'));

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-side', 'card-front');
    cardFront.textContent = word;

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-side', 'card-back');
    cardBack.textContent = meaning;

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    flashcard.appendChild(card);
    flashcardsContainer.appendChild(flashcard);
}

document.getElementById('export-btn').addEventListener('click', () => {
    const dataStr = JSON.stringify(flashcards, null, 2); // Chuyển đổi mảng flashcards sang chuỗi JSON
    const blob = new Blob([dataStr], { type: 'application/json' }); // Tạo file blob JSON
    const url = URL.createObjectURL(blob); // Tạo URL tải xuống từ file blob

    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.json'; // Tên file khi tải xuống
    link.click();

    URL.revokeObjectURL(url); // Giải phóng bộ nhớ
});

document.getElementById('import-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('import-file');
    if (fileInput.files.length === 0) {
        alert('Vui lòng chọn file để nhập!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result); // Chuyển dữ liệu JSON thành đối tượng
            if (Array.isArray(importedData)) {
                flashcards = importedData; // Cập nhật mảng flashcards
                saveToLocalStorage(); // Lưu dữ liệu vào localStorage
                reloadFlashcardsUI(); // Tải lại giao diện
                alert('Dữ liệu đã được nhập thành công!');
            } else {
                throw new Error('File không đúng định dạng!');
            }
        } catch (error) {
            alert('Lỗi khi nhập dữ liệu: ' + error.message);
        }
    };

    reader.readAsText(file); // Đọc nội dung file
});

// Tải lại giao diện flashcards
function reloadFlashcardsUI() {
    const flashcardsContainer = document.getElementById('flashcards-container');
    flashcardsContainer.innerHTML = ''; // Xóa giao diện cũ
    flashcards.forEach(card => addFlashcardToUI(card.word, card.meaning));
}

// Load flashcards when the page loads
window.onload = () => {
    loadFromLocalStorage();
};
