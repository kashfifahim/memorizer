document.getElementById('start').addEventListener('click', function() {
    const inputSection = document.getElementById('input-section');
    const memorizationSection = document.getElementById('memorization-section');
    const userInput = document.getElementById('user-input');
    const targetTextElement = document.getElementById('target-text');
    const repetitionCounter = document.getElementById('repetition-counter');
    const nextButton = document.getElementById('next');

    let lines = document.querySelector('textarea').value.split('\n');
    lines = lines.filter(line => line.trim() !== '');

    console.log(lines);

    if (lines.length === 0) {
        alert('Please eneter text to memorize.');
        return;
    }

    let currentLineIndex = 0;
    let repetitions = 0;

    function setTargetText() {
        targetTextElement.textContent = lines[currentLineIndex];
        repetitionCounter.textContent = `${repetitions+1}/10`;
        userInput.value = '';
        userInput.style.color = 'black';
    }

    function checkInput() {
        const userInputText = userInput.value;
        const targetText = lines[currentLineIndex];

        if (userInputText === targetText) {
            userInput.style.color = 'green';
            repetitions++;

            if (repetitions >= 10) {
                repetitions = 0;
                currentLineIndex++;
            }

            if (currentLineIndex >= lines.length) {
                alert('Congratulations! You have completed all lines.');
                location.reload();
                return;
            }

            setTimeout(setTargetText, 1000);
        } else {
            const isCorrectSoFar = targetText.startsWith(userInputText);
            userInput.style.color = isCorrectSoFar ? 'black' : 'red';
        }
    }

    userInput.addEventListener('input', checkInput);
    nextButton.addEventListener('click', function() {
        repetitions = 0;
        currentLineIndex++;
        setTargetText();
    });

    setTargetText();
    inputSection.hidden = true;
    memorizationSection.hidden = false;
    userInput.focus();
});