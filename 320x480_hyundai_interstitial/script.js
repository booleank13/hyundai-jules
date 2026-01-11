document.addEventListener('DOMContentLoaded', () => {
    // State
    let selectedModel = 'i20';
    let selectedColor = 'white';

    // Elements
    const sceneIntro = document.getElementById('scene-intro');
    const sceneModel = document.getElementById('scene-model');
    const sceneConfig = document.getElementById('scene-config');
    const sceneEnd = document.getElementById('scene-end');

    const btnStart = document.getElementById('btn-start');
    const btnFinish = document.getElementById('btn-finish');
    const btnReplay = document.getElementById('btn-replay');

    const modelOptions = document.querySelectorAll('.model-option');
    const colorBtns = document.querySelectorAll('.color-btn');

    const configCarImage = document.getElementById('config-car-image');
    const selectedModelName = document.getElementById('selected-model-name');
    const finalCarImage = document.getElementById('final-car-image');

    // Model Data (Images map)
    const models = {
        'i20': 'images/hyundai_i20.jpg',
        'tucson': 'images/hyundai_tucson.jpg'
    };

    // Navigation Functions
    function switchScene(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    // Event Listeners

    // 1. Start -> Model Select
    btnStart.addEventListener('click', () => {
        switchScene(sceneIntro, sceneModel);
    });

    // 2. Model Select -> Configurator
    modelOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedModel = option.dataset.model;

            // Update Configurator UI
            selectedModelName.textContent = selectedModel === 'i20' ? 'i20' : 'TUCSON';
            configCarImage.src = models[selectedModel];

            // Reset Color to White
            resetColorSelection();

            switchScene(sceneModel, sceneConfig);
        });
    });

    // Color Logic
    function resetColorSelection() {
        selectedColor = 'white';
        colorBtns.forEach(btn => btn.classList.remove('selected'));
        document.querySelector('[data-color="white"]').classList.add('selected');
        applyColor('white');
    }

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            // Apply Color
            selectedColor = btn.dataset.color;
            applyColor(selectedColor);
        });
    });

    function applyColor(color) {
        // Since we are using JPEGs with backgrounds, we can't just tint the image perfectly.
        // We will use CSS filters to simulate a mood/tint change.
        // This is a creative compromise for standard web ads without 3D canvas or perfect PNGs.

        configCarImage.style.filter = 'none'; // Reset

        if (color === 'red') {
            // Subtle warm tint
            configCarImage.style.filter = 'sepia(0.3) hue-rotate(-50deg) saturate(1.5)';
        } else if (color === 'blue') {
            // Cool tint
            configCarImage.style.filter = 'sepia(0.3) hue-rotate(180deg) saturate(1.2)';
        } else if (color === 'grey') {
            // Desaturate
            configCarImage.style.filter = 'grayscale(0.8) contrast(1.1)';
        } else {
            // White (Original, mostly)
            configCarImage.style.filter = 'none';
        }
    }

    // 3. Configurator -> End Card
    btnFinish.addEventListener('click', () => {
        // Prepare End Card
        finalCarImage.src = models[selectedModel];
        // Apply the same filter to the final image
        finalCarImage.style.filter = configCarImage.style.filter;

        switchScene(sceneConfig, sceneEnd);
    });

    // Replay
    btnReplay.addEventListener('click', () => {
        switchScene(sceneEnd, sceneIntro);
    });
});
