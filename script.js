import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://svfaoiofpyzovkdqrsqo.supabase.co';
const supabaseKey = 'sb_publishable_LIGKz-_pNueJeC054YMMDg_PjtG1FCQ';
const supabase = createClient(supabaseUrl, supabaseKey, { 
    global: { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } } 
});

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const catButtons = document.querySelectorAll('.cat-btn');

let allProducts = []; 
let activeCategory = 'Semua';

async function loadProducts() {
    const { data, error } = await supabase.from('produk').select('*').order('id', { ascending: false });
    if (error) { productGrid.innerHTML = '<p>Gagal muat data.</p>'; return; }
    allProducts = data;
    filterAndRender();
}

function filterAndRender() {
    const searchText = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(item => {
        const matchCategory = (activeCategory === 'Semua' || item.kategori === activeCategory);
        const matchSearch = item.nama.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });
    render(filtered);
}

function render(data) {
    productGrid.innerHTML = ''; 
    if (data.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px 0; color: #999;">Produk tidak ditemukan... 🔍</p>';
        return;
    }
    data.forEach(item => {
        productGrid.innerHTML += `
            <div class="product-card">
                <img src="${item.gambar}" alt="${item.nama}">
                <h3>${item.nama}</h3>
                <p>${item.kategori}</p>
                <a href="${item.link}" target="_blank" class="btn-beli">Lihat Produk</a>
            </div>`;
    });
}

catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-cat');
        filterAndRender();
    });
});

searchInput.addEventListener('input', () => filterAndRender());
loadProducts();
