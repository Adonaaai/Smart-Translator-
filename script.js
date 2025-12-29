// Global DOM elements
const translateBtn = document.getElementById("translate-btn");
const spinner = document.getElementById("spinner");
const resultContainer = document.getElementById("result-container");
const textOutput = document.getElementById("text-output");
const errorMessage = document.getElementById("error-message");
const errorContainer = document.getElementById("error-container");
const buttonText = document.getElementById("button-text");

// API Configuration
const apiURL = "https://openrouter.ai/api/v1/chat/completions";

async function translateText() {
    // 1. Get User Settings
    const apiKey = document.getElementById("api-key-input").value.trim();
    // Default to free model if empty
    let model = document.getElementById("model-input").value.trim();
    if (!model) model = "arcee-ai/trinity-mini:free";

    // 2. Validation
    if (!apiKey) {
        alert("Please enter your OpenRouter API Key! 🔑");
        return;
    }

    const sourceLang = document.getElementById("source-lang").value;
    const targetLang = document.getElementById("target-lang").value;
    const inputText = document.getElementById("text-input").value;

    if (!inputText) {
        alert("Please enter some text to translate.");
        return;
    }

    // 3. UI Updates (Start Loading)
    translateBtn.disabled = true;
    buttonText.textContent = "Translating...";
    spinner.classList.remove("hidden");
    spinner.classList.add("loader");
    errorContainer.classList.add("hidden"); // Hide previous errors
    resultContainer.classList.add("hidden"); // Hide previous results

    // 4. Prepare the Prompt
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return ONLY the translated text, do not add any quotes or explanations:\n\n"${inputText}"`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.href, // For OpenRouter rankings
            "X-Title": "Smart Translator"
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: "system", 
                    content: "You are a professional translator. Output only the translated text."
                },
                {
                    role: "user", 
                    content: prompt
                }
            ]
        })
    };

    try {
        const response = await fetch(apiURL, requestOptions);
        
        // Handle API Errors (like 401 Unauthorized)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        // 5. Display Result
        if (data.choices && data.choices[0]) {
             textOutput.textContent = data.choices[0].message.content;
             resultContainer.classList.remove("hidden");
        } else {
             throw new Error("No translation returned from API.");
        }

    } catch (err) {
        // Handle Network or Logic Errors
        errorMessage.textContent = `Error: ${err.message}`;
        errorContainer.classList.remove("hidden");
        console.error("Translation error:", err);
    } finally {
        // 6. Reset UI (Stop Loading)
        spinner.classList.remove("loader");
        spinner.classList.add("hidden");
        translateBtn.disabled = false;
        buttonText.textContent = "Translate";
    }
}

// Event Listener
translateBtn.addEventListener("click", translateText);


