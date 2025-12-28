// Global variables
const translateBtn = document.getElementById("translate-btn");
const spinner = document.getElementById("spinner");
const resultContainer = document.getElementById("result-container");
const textOutput = document.getElementById("text-output");
const errorMessage = document.getElementById("error-message");
const errorContainer = document.getElementById("error-container");
const apiURL = new URL("https://openrouter.ai/api/v1/chat/completions");
const apiKey = ""; // Enter your OpenRouter API key here!!!
const buttonText = document.getElementById("button-text");

// Async function for translation
async function translateText() {
    // Disable button during translation
    translateBtn.disabled = true;
    buttonText.textContent = "Translating...";
    
    // Loading spinner
    spinner.classList.remove("hidden");
    spinner.classList.add("loader");

    // Get input values
    const sourceLang = document.getElementById("source-lang").value;
    const targetLang = document.getElementById("target-lang").value;
    const inputText = document.getElementById("text-input").value;
    
    // Template literals (backticks) are kept for dynamic variables
    const prompt = `Translate the following content from ${sourceLang} to ${targetLang}:\n\n"${inputText}"`;

    // Request configuration
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": apiKey
        },
        body: JSON.stringify({
            model: "", // AI model for translation
            messages: [
                // System (AI) and User relationship
                {role: "system", content: "You are a translation engine. You simply translate the input text. Do not add any conversational text, explanations, notes, or punctuation that is not part of the translation. Return ONLY the translated string."},
                {role: "user", content: prompt}
            ]
        })
    };

    // Clear previous error messages
    errorMessage.textContent = "";  
    
    try {
        // Call OpenRouter API
        const response = await fetch(apiURL, requestOptions);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }
        // Display translation result
        textOutput.textContent = data.choices[0].message.content; // Translation content
        resultContainer.classList.remove("hidden");

    } catch (err) {
        // Display error message
        errorMessage.textContent = "Something went wrong ❌. Please try again later.";
        console.error("Translation error:", err);

    } finally {
        // Hide spinner
        spinner.classList.remove("loader");
        spinner.classList.add("hidden");
        
        // Re-enable button after translation
        translateBtn.disabled = false;
        buttonText.textContent = "Translate";
    }
}

translateBtn.addEventListener("click", translateText);