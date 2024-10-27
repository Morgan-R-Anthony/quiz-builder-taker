document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quizForm');
    const nameInput = document.getElementById('question-box-1');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        
        if (name) {
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
                    console.log('Name saved successfully with ID:', data.creatorId);
                    window.location.href = 'index.html';
                } else {
                    console.error('Failed to save name:', data.error);
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
