let currentJoke = null;

// Function to fetch and display a joke
function fetchJoke(type = 'random') {
    const jokeDisplay = document.getElementById("joke-display");
    const newJokeBtn = document.getElementById("new-joke-btn");
    
    // Add loading state
    jokeDisplay.innerHTML = '<div class="loading"></div>';
    newJokeBtn.disabled = true;
    
    // Determine API endpoint based on type
    let apiUrl;
    if (type === 'programming') {
        apiUrl = 'https://official-joke-api.appspot.com/jokes/programming/random';
    } else if (type === 'knock-knock') {
        apiUrl = 'https://official-joke-api.appspot.com/jokes/knock-knock/random';
    } else if (type === 'general') {
        apiUrl = 'https://official-joke-api.appspot.com/jokes/general/random';
    } else {
        apiUrl = 'https://official-joke-api.appspot.com/random_joke';
    }
    
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Handle array response for specific categories
            const joke = Array.isArray(data) ? data[0] : data;
            currentJoke = joke;
            jokeDisplay.innerHTML = `
                <div class="joke-content">
                    <h3 class="joke-setup">${joke.setup}</h3>
                    <p class="joke-punchline">${joke.punchline}</p>
                </div>
            `;
            newJokeBtn.disabled = false;
        })
        .catch((error) => {
            console.error("Error fetching joke:", error);
            jokeDisplay.innerHTML = '<p class="error">Oops! Failed to load joke. Try again!</p>';
            newJokeBtn.disabled = false;
        });
}

// Function to copy joke to clipboard
function copyJoke() {
    if (!currentJoke) return;
    
    const jokeText = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
    navigator.clipboard.writeText(jokeText).then(() => {
        const copyBtn = document.getElementById("copy-btn");
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
}

// Function to share on WhatsApp
function shareOnWhatsApp() {
    if (!currentJoke) return;
    
    const jokeText = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
    const url = `https://wa.me/?text=${encodeURIComponent(jokeText)}`;
    window.open(url, '_blank');
}

// Add click handlers to category cards
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            card.classList.add('active');
            
            // Fetch joke based on category
            const categories = ['general', 'programming', 'knock-knock', 'random'];
            fetchJoke(categories[index]);
        });
    });
});

// Load initial joke
fetchJoke();