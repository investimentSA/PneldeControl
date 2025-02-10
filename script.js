// Obtener createClient desde window.supabase
const { createClient } = window.supabase;

// Configuración de Supabase
const supabaseUrl = 'https://lgvmxoamdxbhtmicawlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxndm14b2FtZHhiaHRtaWNhd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NjA0NDIsImV4cCI6MjA1NDIzNjQ0Mn0.0HpIAqpg3gPOAe714dAJPkWF8y8nQBOK7_zf_76HFKw';

// Inicializar Supabase correctamente
const supabase = createClient(supabaseUrl, supabaseKey);

// Manejar el inicio de sesión
document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Correo o contraseña incorrectos');
    } else {
      alert('¡Inicio de sesión exitoso!');
      window.location.href = 'fichaje.html';
    }
  } catch (error) {
    alert('Error al intentar iniciar sesión');
    console.error(error);
  }
});

// Manejar el registro de usuario
document.getElementById("registroForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const nombreCompleto = document.getElementById("nombreCompleto").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validar que los campos no estén vacíos
  if (!nombreCompleto || !email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    // Registro en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { nombre: nombreCompleto }, // Guardar el nombre como metadato en Auth
      },
    });

    if (error) {
      alert("Error al crear la cuenta: " + error.message);
      return;
    }

    // Verifica si la respuesta contiene datos, lo que significa que la cuenta fue creada
    if (data) {
      // Insertar los datos del usuario en la tabla 'usuarios', excluyendo la contraseña
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert([{
          nombre: nombreCompleto,
          correo: email,
        }]);

      if (insertError) {
        alert("Error al registrar los datos del usuario: " + insertError.message);
        return;
      }

      alert("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      window.location.href = "index.html"; // Redirigir al login
    }
  } catch (error) {
    alert("Hubo un error en el registro: " + error.message);
  }
});