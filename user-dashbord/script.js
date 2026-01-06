document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const responseArea = document.getElementById('responseArea');
    const responseText = document.getElementById('responseText');
    const form = document.getElementById('feedbackForm');

    // Get values
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const reviewInput = document.getElementById('review');

    if (!ratingInput) {
        alert('Please select a rating');
        return;
    }

    const payload = {
        rating: parseInt(ratingInput.value),
        review: reviewInput.value
    };

    // UI Loading State
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:8000/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Success State
        form.classList.add('hidden');
        if (form.style) form.style.display = 'none'; // Ensure it hides

        responseArea.classList.remove('hidden');
        responseText.textContent = data.user_reply;


    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        // Reset UI
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

document.getElementById('closeResponse').addEventListener('click', function () {
    const responseArea = document.getElementById('responseArea');
    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');

    // Reset Form
    form.reset();
    form.style.display = 'block';

    // Reset UI
    responseArea.classList.add('hidden');
    btnText.classList.remove('hidden');
    loader.classList.add('hidden');
    submitBtn.disabled = false;
});
