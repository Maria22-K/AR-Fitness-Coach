document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
        });
    }

    // Uhrzeit aktualisieren
    function updateDateTime() {
        const now = new Date();
        document.getElementById("datetime").textContent =
            `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} - ${now.toLocaleTimeString()}`;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Fortschritt aktualisieren
    function updateValue(exercise) {
        let element = document.getElementById(exercise);
        let progressBar = document.getElementById(`progress-${exercise}`);

        if (!element || !progressBar) return; // Falls ein Element nicht existiert, Fehler vermeiden

        let currentValue = parseInt(element.textContent, 10) || 0;
        currentValue++;

        element.textContent = currentValue;
        progressBar.value = currentValue;

        updateChart();
    }

    // Event Listeners für Buttons hinzufügen (Fix für nicht reagierende Buttons)
    const exercises = ["kniebeugen", "squats", "liegestuetze", "situps", "dehnungen"];
    exercises.forEach(exercise => {
        let button = document.getElementById(`btn-${exercise}`);
        if (button) {
            button.addEventListener("click", function () {
                updateValue(exercise);
            });
        } else {
            console.warn(`Button für ${exercise} nicht gefunden!`);
        }
    });

    // Chart.js Diagramm für Fitness-Daten
    const ctx = document.getElementById("exerciseChart").getContext("2d");
    const fitnessChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Kniebeugen", "Squats", "Liegestütze", "Sit-ups", "Dehnungen"],
            datasets: [{
                label: "Übungszähler",
                data: [0, 0, 0, 0, 0], // Startwerte für Balkendiagramm
                backgroundColor: ["red", "blue", "green", "purple", "orange"],
                borderColor: "white",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Funktion zum Aktualisieren des Diagramms
    function updateChart() {
        fitnessChart.data.datasets[0].data = [
            parseInt(document.getElementById("kniebeugen").textContent, 10) || 0,
            parseInt(document.getElementById("squats").textContent, 10) || 0,
            parseInt(document.getElementById("liegestuetze").textContent, 10) || 0,
            parseInt(document.getElementById("situps").textContent, 10) || 0,
            parseInt(document.getElementById("dehnungen").textContent, 10) || 0
        ];
        fitnessChart.update();
    }

    // Initiale Aktualisierung beim Laden der Seite
    updateChart();
});