document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });        

        const data = await response.json();

        if (data.success) {
            alert('Inicio de sesión exitoso');
            // Redirigir al usuario a main.html
            window.location.href = 'main.html';
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión. Inténtalo nuevamente');
    }
});
