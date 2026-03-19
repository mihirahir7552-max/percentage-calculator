document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('tiltCard');
    const container = document.querySelector('.content-area');
    const marksInput = document.getElementById('marks');
    const totalMarksInput = document.getElementById('totalMarks');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const percentageValue = document.getElementById('percentageValue');
    const congratsMsg = document.getElementById('congratsMsg');
    const particlesContainer = document.getElementById('particles');

    // 1. 3D Parallax Tilt Effect on Card
    container.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of the screen
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    container.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
        // Pop out the elements a bit more
        document.querySelector('.title').style.transform = 'translateZ(50px)';
    });

    container.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
        document.querySelector('.title').style.transform = 'translateZ(30px)';
    });

    // 2. Generate Ambient Background Particles
    createParticles();

    // 3. Calculation Logic
    calculateBtn.addEventListener('click', () => {
        const marks = parseFloat(marksInput.value);
        const totalMarks = parseFloat(totalMarksInput.value);

        // Validation
        if (isNaN(marks) || isNaN(totalMarks) || totalMarks <= 0 || marks < 0) {
            alert("Please enter valid positive numbers. Make sure the total marks is greater than 0.");
            return;
        }

        if (marks > totalMarks) {
            alert("Obtained marks cannot be greater than Total Marks.");
            return;
        }

        // Calculate
        const percentage = (marks / totalMarks) * 100;

        // Reset container animation
        resultContainer.classList.remove('hidden');
        resultContainer.classList.remove('show');
        void resultContainer.offsetWidth; // Trigger reflow
        resultContainer.classList.add('show');

        // Custom message based on score (updated for Light Theme)
        if (percentage === 100) {
            congratsMsg.textContent = "Perfect Score! Amazing!";
            congratsMsg.style.background = "linear-gradient(to right, #FF416C, #FFAF7B)";
        } else if (percentage >= 80) {
            congratsMsg.textContent = "Congratulations! Great Result!";
            congratsMsg.style.background = "linear-gradient(to right, #3A1C71, #D76D77)";
        } else if (percentage >= 50) {
            congratsMsg.textContent = "Good Job! Keep it up!";
            congratsMsg.style.background = "linear-gradient(to right, #00B4DB, #0083B0)";
        } else {
            congratsMsg.textContent = "You can do better! Keep trying.";
            congratsMsg.style.background = "linear-gradient(to right, #cb2d3e, #ef473a)";
        }

        // Update background gradient direction to mask text properties
        congratsMsg.style.webkitBackgroundClip = "text";
        congratsMsg.style.webkitTextFillColor = "transparent";

        // Count up animation
        animateValue(percentageValue, 0, percentage, 1500);

        // Party time
        fireConfetti();
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Format to 2 decimal places if needed, or whole number if round
            const currentVal = progress * (end - start) + start;
            obj.innerHTML = currentVal % 1 === 0 ? currentVal.toFixed(0) : currentVal.toFixed(2);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function createParticles() {
        const particleColors = ['rgba(255, 65, 108, 0.4)', 'rgba(58, 28, 113, 0.4)', 'rgba(215, 109, 119, 0.4)'];
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
            particle.style.borderRadius = '50%';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.opacity = Math.random() * 0.5 + 0.3;

            // Simple floating animation for particles
            const duration = Math.random() * 20 + 10;
            particle.animate([
                { transform: `translate(0, 0)` },
                { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px)` },
                { transform: `translate(0, 0)` }
            ], {
                duration: duration * 1000,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'ease-in-out'
            });

            particlesContainer.appendChild(particle);
        }
    }

    function fireConfetti() {
        const colors = ['#FF416C', '#3A1C71', '#D76D77', '#FFAF7B', '#00B4DB'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            createConfettiParticle(colors[Math.floor(Math.random() * colors.length)]);
        }
    }

    function createConfettiParticle(color) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random starting position near the calculator
        const startX = 50 + (Math.random() * 30 - 15);
        confetti.style.left = startX + 'vw';
        confetti.style.top = '40vh';
        confetti.style.backgroundColor = color;

        // Shapes
        const num = Math.random();
        if (num > 0.6) {
            confetti.style.borderRadius = '50%';
        } else if (num > 0.3) {
            // Triangle
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = '6px solid transparent';
            confetti.style.borderRight = '6px solid transparent';
            confetti.style.borderBottom = `12px solid ${color}`;
            confetti.style.width = '0';
            confetti.style.height = '0';
        }

        document.body.appendChild(confetti);

        // Destructive Physics Animation for confetti
        const tx = (Math.random() - 0.5) * 100 + 'vw';
        const ty = (Math.random() * 60 + 40) + 'vh';
        const rot = Math.random() * 720 + 'deg';

        const animation = confetti.animate([
            { transform: 'translate3d(0,0,0) rotate(0)', opacity: 1 },
            { transform: `translate3d(${tx}, ${ty}, 0) rotate(${rot})`, opacity: 0 }
        ], {
            duration: Math.random() * 1500 + 1000,
            easing: 'cubic-bezier(.37,0,.63,1)',
            fill: 'forwards'
        });

        animation.onfinish = () => confetti.remove();
    }
});
