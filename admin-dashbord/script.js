document.addEventListener('DOMContentLoaded', () => {
    fetchReviews();
});

document.getElementById('refreshBtn').addEventListener('click', fetchReviews);

async function fetchReviews() {
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = '<div class="loading-state">Loading reviews...</div>';

    try {
        const response = await fetch('http://localhost:8000/reviews');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        renderReviews(data.reviews);
        updateStats(data.reviews);

    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<div class="loading-state" style="color: #ef4444">Failed to load reviews. Check backend connection.</div>';
    }
}

function renderReviews(reviews) {
    const grid = document.getElementById('reviewsGrid');

    if (reviews.length === 0) {
        grid.innerHTML = '<div class="loading-state">No reviews yet.</div>';
        return;
    }

    grid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="card-header">
                <div class="rating">★ ${review.rating}</div>
                <span class="date">${formatDate(review.created_at)}</span>
            </div>
            <p class="review-text">"${review.review_text}"</p>
            
            <div class="analysis-box">
                <div class="analysis-item">
                    <span class="label">Summary</span>
                    <p class="content">${review.summary}</p>
                </div>
                <div class="analysis-item">
                    <span class="label">Recommended Action</span>
                    <p class="content ${getActionColor(review.recommended_action)}">${review.recommended_action}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats(reviews) {
    // Total Reviews
    document.getElementById('totalReviews').innerText = reviews.length;

    // Average Rating
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0.0;
    document.getElementById('avgRating').innerText = avg;

    // Pending Actions (Simple heuristic: if action is not "No action" or similar)
    // In a real app, this would be a flag in the DB.
    // For now, let's just count all as "active" or maybe simple length.
    document.getElementById('pendingActions').innerText = reviews.length;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getActionColor(action) {
    if (action.toLowerCase().includes('none') || action.toLowerCase().includes('no action')) return '';
    return 'action-needed';
}
