document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quizForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nameInput = document.getElementById('question-box-1');
        const name = nameInput.value.trim();
        
        if (name) {
            // Send a POST request to the server
            fetch('/save-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'index.html';
                } else {
                    alert("Error saving name. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred. Please try again.");
            });
        } else {
            alert("Please enter your name before creating a quiz.");
        }
    });
});