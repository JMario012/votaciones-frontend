const API_URL = "https://votaciones-backend.onrender.com"; // Reemplaza con tu URL

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_URL}/api/candidatos`);
        const candidatos = await response.json();
        renderCandidatos(candidatos);
    } catch (error) {
        console.error("Error al cargar candidatos:", error);
        alert("Error al cargar los candidatos. Recarga la página.");
    }
});

function renderCandidatos(candidatos) {
    const container = document.getElementById('candidatos-container');
    container.innerHTML = candidatos.map(candidato => `
        <div class="candidate-card">
            <h2>${candidato.nombre}</h2>
            <p>${candidato.partido}</p>
            <button class="btn-votar" data-id="${candidato.id}">Votar</button>
        </div>
    `).join('');

    // Event listeners para botones de votar
    document.querySelectorAll('.btn-votar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const candidatoId = btn.getAttribute('data-id');
            try {
                const response = await fetch(`${API_URL}/api/votar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ candidatoId }),
                });
                const data = await response.json();
                alert(`¡Voto registrado para ${candidato.nombre}!`);
            } catch (error) {
                console.error("Error al votar:", error);
                alert("Error al registrar el voto. Intenta nuevamente.");
            }
        });
    });
}