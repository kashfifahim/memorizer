document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(fileEvent) {
            const contents = fileEvent.target.result;
            // You can now use the content of the file as needed in your application
            document.querySelector('textarea').value = contents;
        };
        reader.readAsText(file);
    }
});

document.getElementById('start').addEventListener('click', function() {
    const inputSection = document.getElementById('input-section');
    const memorizationSection = document.getElementById('memorization-section');
    const userInput = document.getElementById('user-input');
    const targetTextElement = document.getElementById('target-text');
    const repetitionCounter = document.getElementById('repetition-counter');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');

    let lines = document.querySelector('textarea').value.split('\n');
    lines = lines.filter(line => line.trim() !== '');

    console.log(lines);

    if (lines.length === 0) {
        alert('Please enter text to memorize.');
        return;
    }

    let currentLineIndex = 0;
    let repetitions = 0;

    function setTargetText() {
        targetTextElement.textContent = lines[currentLineIndex];
        repetitionCounter.textContent = `${repetitions+1}/10`;
        userInput.value = '';
        userInput.style.color = 'black';

        prevButton.style.visibility = (currentLineIndex === 0) ? 'hidden' : 'visible';
        nextButton.style.visibility = (currentLineIndex === lines.length - 1) ? 'hidden' : 'visible';
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