// src/components/NamePage.js
import React, { useState } from 'react';

const NamePage = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [creatorName, setCreatorName] = useState('');

  // Toggle visibility of instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (creatorName.trim()) {
        fetch('/save-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: creatorName }),
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
};

  return (
    <div className="container">
      <div className="NameForm">
        <h2>Want to create a Quiz?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">Create Quiz</button>
        </form>

        {/* Instructions Dropdown */}
        <button onClick={toggleInstructions} className="instructions-toggle-btn">
          {showInstructions ? 'Hide Instructions ▲' : 'Show Instructions ▼'}
        </button>
        {showInstructions && (
          <div className="instructions-box">
            <h3>Instructions</h3>
            <ul>
              <li>Enter your name to start creating a quiz.</li>
              <li>Follow the prompts to add questions and answers.</li>
              <li>Ensure you have at least one correct answer per question.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NamePage;



// Render the React component




