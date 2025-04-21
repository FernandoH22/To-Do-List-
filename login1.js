
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('loggedIn') === 'true' && localStorage.getItem('currentUser')) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById('loginBtn').addEventListener('click', function() {
        const nombre = document.getElementById('nombre').value.trim();
        const contraseña = document.getElementById('contraseña').value.trim();

        if (!nombre || !contraseña) {
            alert("Por favor complete todos los campos");
            return;
        }

        if (nombre === "demo" && contraseña === "EduarLindo") {
            localStorage.setItem('currentUser', 'demo');
            localStorage.setItem('loggedIn', 'true');
            
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
            window.location.href = window.location.pathname.replace('login.html', 'index.html');
        } else {
            alert("Contraseña incorrecta");
        }
    });

    document.getElementById('contraseña').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });
});
