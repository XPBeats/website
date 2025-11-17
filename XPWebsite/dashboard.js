let products = [];
let users = [
  { id: 1, email: "user1@example.com", role: "guest" },
  { id: 2, email: "producer@xplab.shop", role: "producer" }
];

document.getElementById('drop-area').onclick = () => document.getElementById('file-input').click();
document.getElementById('file-input').onchange = e => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('audio/')) return alert("Audio files only.");
  const url = URL.createObjectURL(file);
  document.getElementById('preview').innerHTML = `<audio controls src="${url}"></audio>`;
  document.getElementById('upload-form').style.display = 'block';
  window.currentFile = { url, file };
};

function saveProduct() {
  const form = document.getElementById('upload-form');
  const newProduct = {
    id: Date.now(),
    name: form.children[0].value || 'New Beat',
    price: parseFloat(form.children[1].value) || 9.99,
    discount: parseInt(form.children[2].value) || 0,
    previewTime: parseInt(form.children[3].value) || 30
  };
  products.push(newProduct);
  renderProducts();
  form.reset(); document.getElementById('upload-form').style.display = 'none';
  document.getElementById('preview').innerHTML = '';
  URL.revokeObjectURL(window.currentFile.url);
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(p => {
    const final = (p.price * (1 - p.discount/100)).toFixed(2);
    return `
      <div class="product-card">
        <div class="product-preview"><audio controls src="placeholder.mp3"></audio></div>
        <h3>${p.name}</h3>
        <p class="price">$${final}</p>
        <button class="btn primary">Buy</button>
      </div>`;
  }).join('');
}

function renderUsers() {
  const list = document.getElementById('user-list');
  list.innerHTML = users.map(u => `
    <div class="user-card">
      <p>${u.email}</p>
      <select onchange="updateRole(${u.id}, this.value)">
        <option ${u.role==='guest'?'selected':''}>guest</option>
        <option ${u.role==='member'?'selected':''}>member</option>
        <option ${u.role==='producer'?'selected':''}>producer</option>
        <option ${u.role==='admin'?'selected':''}>admin</option>
      </select>
    </div>
  `).join('');
}

function updateRole(id, role) {
  const user = users.find(u => u.id === id);
  if (user) user.role = role;
}