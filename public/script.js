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
    const question = questionBox.value;
    const answers = Array.from(listContainer.children).map(li => li.textContent.slice(0, -1));

    fetch('/save-quiz-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardNumber, question, answers }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Data for card ${cardNumber} saved successfully`);
        } else {
            console.error(`Error saving data for card ${cardNumber}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function showTask() {
    for (let i = 1; i <= 10; i++) {
        fetch(`/get-quiz-data/${i}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const listContainer = document.getElementById(`list-container-${i}`);
                    const questionBox = document.getElementById(`question-box-${i}`);
                    questionBox.value = data.question || '';
                    listContainer.innerHTML = data.answers.map(answer => 
                        `<li>${answer}<span>\u00d7</span></li>`
                    ).join('');
                }
            })
            .catch(error => console.error('Error:', error));
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