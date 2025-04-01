// Mostrar página inicial por defecto
showPage('home');

// Navegación entre páginas
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');

  // Cargar entradas del blog si se selecciona esa página
  if (pageId === 'blog') {
    fetchPosts();
  }
}

// Blog: Cargar entradas
async function fetchPosts() {
  const response = await fetch('/api/posts');
  const posts = await response.json();
  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = '';
  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
    postsDiv.appendChild(postDiv);
  });
}

// Blog: Agregar entrada
document.getElementById('blogForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  if (response.ok) {
    fetchPosts(); // Recargar entradas
    document.getElementById('blogForm').reset(); // Limpiar formulario
  }
});

// Calculadora de fecha de parto
function calculateDueDate() {
    const inseminationDate = new Date(document.getElementById('inseminationDate').value);
    if (!inseminationDate) {
      document.getElementById('result').innerHTML = 'Por favor, selecciona una fecha.';
      return;
    }
  
    const gestationDays = 114; // Gestación promedio de una cerda
    const dueDate = new Date(inseminationDate);
    dueDate.setDate(dueDate.getDate() + gestationDays);
  
    document.getElementById('result').innerHTML = 
      `Fecha estimada de parto: ${dueDate.toLocaleDateString()}<br>` +
      `<span>Nota: El parto puede adelantarse o atrasarse 1-2 días.</span>`;
  }