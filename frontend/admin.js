// Update this with your Render Backend URL
const RENDER_BACKEND_URL = "https://ai-feedback-system-urv6.onrender.com";

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? "http://localhost:8000"
    : RENDER_BACKEND_URL;

async function fetchReviews() {
    const tbody = document.getElementById('reviewsBody');

    try {
        const response = await fetch(`${API_URL}/reviews`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        const reviews = data.reviews;

        if (reviews.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No reviews found.</td></tr>`;
            return;
        }

        tbody.innerHTML = reviews.map(review => `
            <tr>
                <td><span class="rating-badge">★ ${review.rating}</span></td>
                <td>${escapeHtml(review.review_text)}</td>
                <td style="color: var(--text-muted); font-size: 0.9em;">${escapeHtml(review.summary)}</td>
                <td><span class="action-text">${escapeHtml(review.recommended_action)}</span></td>
                <td style="color: var(--text-muted); font-size: 0.85em;">${new Date(review.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--error);">Error loading data. Is the backend running?</td></tr>`;
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initial Load
document.addEventListener('DOMContentLoaded', fetchReviews);

// Refresh Button
document.getElementById('refreshBtn').addEventListener('click', () => {
    const tbody = document.getElementById('reviewsBody');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Refreshing...</td></tr>`;
    fetchReviews();
});

// Auto Refresh every 30 seconds
setInterval(fetchReviews, 30000);
