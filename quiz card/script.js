const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
function addTask(cardNumber) {
    const questionBox = document.getElementById(`question-box-${cardNumber}`);
    const inputBox = document.getElementById(`input-box-${cardNumber}`);
    const listContainer = document.getElementById(`list-container-${cardNumber}`);

    if (inputBox.value === '') {
        alert("Please write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData(cardNumber);
}

document.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("check");
        saveData(getCardNumber(e.target));
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData(getCardNumber(e.target));
    }
});

function getCardNumber(element) {
    return element.closest('.QuizCard').id.split('-')[1];
}

function saveData(cardNumber) {
    const listContainer = document.getElementById(`list-container-${cardNumber}`);
    const questionBox = document.getElementById(`question-box-${cardNumber}`);
    localStorage.setItem(`data-${cardNumber}`, listContainer.innerHTML);
    localStorage.setItem(`question-${cardNumber}`, questionBox.value);
}

function showTask() {
    for (let i = 1; i <= 10; i++) {
        const listContainer = document.getElementById(`list-container-${i}`);
        const questionBox = document.getElementById(`question-box-${i}`);
        listContainer.innerHTML = localStorage.getItem(`data-${i}`) || '';
        questionBox.value = localStorage.getItem(`question-${i}`) || '';
    }
}

for (let i = 1; i <= 10; i++) {
    const questionBox = document.getElementById(`question-box-${i}`);
    questionBox.addEventListener('input', () => saveData(i));
}

showTask();

function submitQuiz() {
    // Collect all quiz data
    let quizData = [];
    for (let i = 1; i <= 10; i++) {
        const questionBox = document.getElementById(`question-box-${i}`);
        const listContainer = document.getElementById(`list-container-${i}`);
        quizData.push({
            question: questionBox.value,
            answers: Array.from(listContainer.children).map(li => li.textContent.slice(0, -1)) 
        });
    }
    
   
    console.log(JSON.stringify(quizData, null, 2));
    alert("Quiz submitted! Check the console for the quiz data.");
}