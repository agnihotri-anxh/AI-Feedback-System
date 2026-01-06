const API_URL = "http://localhost:8000"; // Update this for production deployment

document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMsg');
    const responseArea = document.getElementById('responseArea');
    const aiReplyText = document.getElementById('aiReplyText');

    // Get form data
    const formData = new FormData(e.target);
    const rating = formData.get('rating');
    const review = formData.get('review');

    if (!rating) {
        statusMsg.textContent = "Please select a star rating.";
        statusMsg.className = "status-msg error";
        return;
    }

    // UI Updates
    submitBtn.disabled = true;
    submitBtn.textContent = "Analyzing...";
    statusMsg.textContent = "";
    responseArea.classList.remove('visible');

    try {
        const response = await fetch(`${API_URL}/submit-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: parseInt(rating),
                review: review
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Success State
        aiReplyText.textContent = data.user_reply;
        responseArea.classList.add('visible');
        statusMsg.textContent = "Feedback submitted successfully!";
        statusMsg.className = "status-msg success";

        // Reset form slightly but keep success message
        e.target.reset();

    } catch (error) {
        console.error('Error:', error);
        statusMsg.textContent = `Failed to submit: ${error.message}`;
        statusMsg.className = "status-msg error";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Feedback";
    }
});
