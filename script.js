import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://svfaoiofpyzovkdqrsqo.supabase.co';
const supabaseKey = 'sb_publishable_LIGKz-_pNueJeC054YMMDg_PjtG1FCQ';
const supabase = createClient(supabaseUrl, supabaseKey, { 
    global: { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } } 
});

const productGrid = document.getElementById('productGrid');
const paginationBox = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const catButtons = document.querySelectorAll('.cat-btn');

let currentPage = 0;
const itemsPerPage = 6; 
let activeCategory = 'Semua';

// Fungsi Tarik Data dari Gudang
async function loadProducts() {
    const from = currentPage * itemsPerPage;
    const to = from + itemsPerPage - 1;
    const searchText = searchInput.value.toLowerCase();

    // Query ke Supabase
    let query = supabase.from('produk').select('*', { count: 'exact' });

    if (activeCategory !== 'Semua') query = query.eq('kategori', activeCategory);
    if (searchText) query = query.ilike('nama', `%${searchText}%`);

    const { data, count, error } = await query
        .order('id', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Gagal ambil data:", error);
        return;
    }
    
    render(data);
    setupPagination(count);
}

// Fungsi Gambar Produk ke Layar
function render(data) {
    productGrid.innerHTML = '';
    if (!data || data.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: #999;">Produk tidak ditemukan... 🔍</p>';
        return;
    }
    data.forEach(item => {
        productGrid.innerHTML += `
            <div class="product-card">
                <img src="${item.gambar}" alt="${item.nama}" loading="lazy">
                <h3>${item.nama}</h3>
                <p>${item.kategori}</p>
                <a href="${item.link}" target="_blank" class="btn-beli">Lihat Produk</a>
            </div>`;
    });
}

// Fungsi Gambar Tombol Navigasi
function setupPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationBox.innerHTML = '';

    // Jangan munculin tombol kalau cuma 1 halaman
    if (totalPages <= 1) return;

    // Tombol Sebelumnya
    const prevBtn = document.createElement('button');
    prevBtn.innerText = '‹'; prevBtn.className = 'page-btn';
    prevBtn.disabled = currentPage === 0;
    prevBtn.onclick = () => { currentPage--; loadProducts(); window.scrollTo(0,0); };
    paginationBox.appendChild(prevBtn);

    // Angka-angka
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i + 1;
        btn.className = (i === currentPage) ? 'page-btn active' : 'page-btn';
        btn.onclick = () => { currentPage = i; loadProducts(); window.scrollTo(0,0); };
        paginationBox.appendChild(btn);
    }

    // Tombol Berikutnya
    const nextBtn = document.createElement('button');
    nextBtn.innerText = '›'; nextBtn.className = 'page-btn';
    nextBtn.disabled = currentPage >= totalPages - 1;
    nextBtn.onclick = () => { currentPage++; loadProducts(); window.scrollTo(0,0); };
    paginationBox.appendChild(nextBtn);
}

// Event Klik Kategori
catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-cat');
        currentPage = 0; // Reset ke hal 1
        loadProducts();
    });
});

// Event Ngetik Cari
searchInput.addEventListener('input', () => {
    currentPage = 0; // Reset ke hal 1
    loadProducts();
});

// Jalankan saat pertama buka
loadProducts();
