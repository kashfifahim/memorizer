document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(fileEvent) {
            const contents = fileEvent.target.result;
            document.querySelector('textarea').value = contents;
        };
        reader.readAsText(file);
    }
});

document.getElementById('start').addEventListener('click', function() {
    const modeElements = document.getElementsByName('mode');
    let mode;
    modeElements.forEach(element => {
        if (element.checked) {
            mode = element.value;
        }
    });

    const inputSection = document.getElementById('input-section');
    const memorizationSection = document.getElementById('memorization-section');
    const userInput = document.getElementById('user-input');
    const targetTextElement = document.getElementById('target-text');
    const repetitionCounter = document.getElementById('repetition-counter');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');

    let lines = document.querySelector('textarea').value.split('\n');
    lines = lines.filter(line => line.trim() !== '');

    if (lines.length === 0) {
        alert('Please enter text to memorize.');
        return;
    }

    let currentLineIndex = 0;
    let repetitions = 0;

    function setTargetText() {
        if (mode === 'multi') {
            // Find the next blank line or end of the text.
            let endIndex = lines.slice(currentLineIndex + 1).findIndex(line => line.trim() === '');
            endIndex = (endIndex !== -1) ? currentLineIndex + endIndex + 1 : lines.length;
            targetTextElement.textContent = lines.slice(currentLineIndex, endIndex).join('\n');
            // Hide the Next and Previous buttons
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            targetTextElement.textContent = lines[currentLineIndex];
            // Show the Next and Previous buttons
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
            prevButton.style.visibility = (currentLineIndex === 0) ? 'hidden' : 'visible';
            nextButton.style.visibility = (currentLineIndex === lines.length - 1) ? 'hidden' : 'visible';
        }
        repetitionCounter.textContent = `${repetitions+1}/10`;
        userInput.value = '';
        userInput.style.color = 'black';
    
        prevButton.style.visibility = (currentLineIndex === 0) ? 'hidden' : 'visible';
        nextButton.style.visibility = (currentLineIndex === lines.length - 1) ? 'hidden' : 'visible';
    }

    function checkInput() {
        const userInputText = userInput.value;
        let targetText;
    
        if (mode === 'multi') {
            // Find the next blank line or end of the text.
            let endIndex = lines.slice(currentLineIndex + 1).findIndex(line => line.trim() === '') + 1;
            endIndex = (endIndex > 0) ? currentLineIndex + endIndex : lines.length;
            targetText = lines.slice(currentLineIndex, endIndex).join('\n');
        } else {
            targetText = lines[currentLineIndex];
        }
    
        if (userInputText === targetText) {
            userInput.style.color = 'green';
            repetitions++;
    
            if (repetitions >= 10) {   // Ensure you're comparing against the number 10, not repetitionCounter element
                alert('You have practiced this line/section 10 times! Well done.');
                repetitions = 0;
                if (mode === 'multi') {
                    // Move to the next chunk after the blank line.
                    let endIndex = lines.slice(currentLineIndex + 1).findIndex(line => line.trim() === '') + 1;
                    currentLineIndex = (endIndex > 0) ? currentLineIndex + endIndex : lines.length;
                } else {
                    currentLineIndex++;
                }
            }
    
            if (currentLineIndex >= lines.length) {
                alert('Congratulations! You have completed all lines.');
                location.reload();
                return;
            }
    
            setTimeout(setTargetText, 500);
        } else {
            const isCorrectSoFar = targetText.startsWith(userInputText);
            userInput.style.color = isCorrectSoFar ? 'black' : 'red';
        }
    }

    userInput.addEventListener('input', checkInput);

    prevButton.addEventListener('click', function() {
        if (currentLineIndex > 0) {
            repetitions = 0;
            currentLineIndex--;
            setTargetText();
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentLineIndex < lines.length - 1) {
            repetitions = 0;
            currentLineIndex++;
            setTargetText();
        }
    });

    setTargetText();
    inputSection.hidden = true;
    memorizationSection.hidden = false;
    userInput.focus();
});