document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('spinner');
    
    const resultContainer = document.getElementById('resultContainer');
    const resultCard = document.getElementById('resultCard');
    const resultText = document.getElementById('resultText');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Predicting...';
        spinner.style.display = 'block';
        
        // Hide previous results securely giving it time to collapse
        resultContainer.classList.add('hidden');
        resultCard.className = 'result-card'; // reset classes

        const data = {
            cgpa: parseFloat(document.getElementById('cgpa').value),
            skills: parseInt(document.getElementById('skills').value),
            projects: parseInt(document.getElementById('projects').value)
        };

        try {
            // Artificial delay to show loading animation (premium feel)
            await new Promise(r => setTimeout(r, 800));

            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                resultText.textContent = result.prediction;
                
                // Add styling based on prediction outcome
                if (result.status_code === 1) {
                    if (result.prediction.includes("conditions")) {
                       resultCard.classList.add('warning-border');
                       resultText.style.color = "var(--warning)";
                    } else {
                        resultCard.classList.add('success-border');
                        resultText.style.color = "var(--success)";
                    }
                } else {
                    resultCard.classList.add('danger-border');
                    resultText.style.color = "var(--danger)";
                }

                // Show results with animation
                resultContainer.classList.remove('hidden');
            } else {
                alert('Error making prediction: ' + result.message);
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server. Please ensure backend is running.');
        } finally {
            // Restore UI
            submitBtn.disabled = false;
            btnText.textContent = 'Predict Eligibility';
            spinner.style.display = 'none';
        }
    });
});
