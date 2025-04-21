// CORRECCIÓN ESPECÍFICA PARA EL LOGIN
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está logueado (CORRECCIÓN AQUÍ)
    if (localStorage.getItem('loggedIn') === 'true' && localStorage.getItem('currentUser')) {
        window.location.href = "index.html";
        return;
    }

    // Función de Login (CORRECCIÓN AQUÍ)
    document.getElementById('loginBtn').addEventListener('click', function() {
        const nombre = document.getElementById('nombre').value.trim();
        const contraseña = document.getElementById('contraseña').value.trim();

        if (!nombre || !contraseña) {
            alert("Por favor complete todos los campos");
            return;
        }

        // Usuario demo
        if (nombre === "demo" && contraseña === "demo123") {
            localStorage.setItem('currentUser', 'demo');
            localStorage.setItem('loggedIn', 'true');
            
            // Redirección ABSOLUTA (CORRECCIÓN CLAVE)
            window.location.href = window.location.pathname.replace('login.html', 'index.html');
            return;
        }

        const userData = JSON.parse(localStorage.getItem(nombre));

        if (!userData) {
            alert("Usuario no registrado");
            return;
        }

        if (userData.password === contraseña) {
            localStorage.setItem('currentUser', nombre);
            localStorage.setItem('loggedIn', 'true');
            // Redirección ABSOLUTA (CORRECCIÓN CLAVE)
            window.location.href = window.location.pathname.replace('login.html', 'index.html');
        } else {
            alert("Contraseña incorrecta");
        }
    });

    // Login con Enter (CORRECCIÓN AQUÍ)
    document.getElementById('contraseña').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });
});