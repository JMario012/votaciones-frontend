const API_URL = "https://votaciones-backend.onrender.com"; // Reemplaza con tu URL
let chart;

async function cargarResultados() {
    try {
        const response = await fetch(`${API_URL}/api/resultados`);
        const resultados = await response.json();
        mostrarResultados(resultados);
        actualizarGrafico(resultados);
    } catch (error) {
        console.error("Error al cargar resultados:", error);
        alert("Error al cargar los resultados. Recarga la página.");
    }
}

function mostrarResultados(resultados) {
    const tbody = document.getElementById('resultsBody');
    const totalVotos = resultados.reduce((sum, r) => sum + r.total_votos, 0);

    tbody.innerHTML = resultados.map(r => {
        const porcentaje = totalVotos > 0 ? ((r.total_votos / totalVotos) * 100).toFixed(2) : 0;
        return `
            <tr>
                <td>${r.candidato_nombre}</td>
                <td>${r.candidato_partido}</td>
                <td>${r.total_votos}</td>
                <td>${porcentaje}%</td>
            </tr>
        `;
    }).join('');
}

function actualizarGrafico(resultados) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: resultados.map(r => r.candidato_nombre),
            datasets: [{
                label: 'Votos',
                data: resultados.map(r => r.total_votos),
                backgroundColor: [
                    '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
                    '#9b59b6', '#1abc9c', '#d35400', '#34495e'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const porcentaje = total > 0 ? ((ctx.raw / total) * 100).toFixed(2) : 0;
                            return `${ctx.raw} votos (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}

document.getElementById('resetBtn')?.addEventListener('click', async () => {
    if (confirm("¿Estás seguro de reiniciar todos los votos?")) {
        try {
            const response = await fetch(`${API_URL}/api/reiniciar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clave: "admin123" }) // Cambia la clave
            });
            const data = await response.json();
            alert(data.success ? "Votos reiniciados" : "Error al reiniciar");
            cargarResultados();
        } catch (error) {
            console.error("Error al reiniciar:", error);
        }
    }
});

document.addEventListener('DOMContentLoaded', cargarResultados);