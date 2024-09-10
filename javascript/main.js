let jornadaIniciada = false;
let horaInicio = null;
let horaFin = null;
let userId = 1;  // Supongamos que tienes el ID del usuario logueado

// Función para habilitar/deshabilitar botones
function toggleButtons() {
    document.getElementById('start-day').disabled = jornadaIniciada;
    document.getElementById('end-day').disabled = !jornadaIniciada;
}

// Función para cambiar entre modo claro/oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Cambiar la clase 'dark-mode'
}

// Evento para el botón de cambiar modo claro/oscuro
document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

// Función para formatear la fecha en el formato 'YYYY-MM-DD HH:MM:SS'
function formatDateForMySQL(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Función para iniciar la jornada
function iniciarJornada() {
    const now = new Date();
    const formattedDate = formatDateForMySQL(now);

    document.getElementById('start-time').textContent = formattedDate;
    jornadaIniciada = true;
    toggleButtons();

    // Llamada AJAX para registrar el inicio de la jornada en la base de datos
    const data = {
        user_id: userId,
        start_time: formattedDate // Usa la fecha formateada
    };

    fetch('http://localhost:3000/api/jornada/iniciar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Jornada iniciada:', data);
    })
    .catch(error => {
        console.error('Error al iniciar jornada:', error);
    });
}

// Función para terminar la jornada
function acabarJornada() {
    const now = new Date();
    const formattedDate = formatDateForMySQL(now);

    document.getElementById('end-time').textContent = formattedDate;
    jornadaIniciada = false;
    toggleButtons();

    // Llamada AJAX para registrar el fin de la jornada en la base de datos
    const data = {
        user_id: userId,
        end_time: formattedDate // Usa la fecha formateada
    };

    fetch('http://localhost:3000/api/jornada/terminar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Jornada finalizada:', data);
    })
    .catch(error => {
        console.error('Error al finalizar jornada:', error);
    });
}

// Función para verificar si hay una jornada activa al cargar la página
function checkJornadaActiva() {
    fetch(`http://localhost:3000/api/jornada/estado/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.jornadaActiva) {
                jornadaIniciada = true;
                const formattedDate = formatDateForMySQL(new Date(data.start_time));
                document.getElementById('start-time').textContent = formattedDate;
                toggleButtons();
            }
        })
        .catch(error => {
            console.error('Error al verificar jornada activa:', error);
        });
}

// Inicializar los botones al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    checkJornadaActiva();  // Verificar si hay una jornada activa
    toggleButtons();  // Asegurarse de que los botones estén en el estado correcto

    // Evento para iniciar la jornada
    document.getElementById('start-day').addEventListener('click', iniciarJornada);

    // Evento para acabar la jornada
    document.getElementById('end-day').addEventListener('click', acabarJornada);
});
