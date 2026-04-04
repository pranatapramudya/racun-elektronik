import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://svfaoiofpyzovkdqrsqo.supabase.co';
const supabaseKey = 'sb_publishable_LIGKz-_pNueJeC054YMMDg_PjtG1FCQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const productGrid = document.getElementById('productGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const catBtns = document.querySelectorAll('.cat-btn');


let currentPage = 0;
const itemsPerPage = 8; 
let currentCategory = 'Semua';
let searchQuery = '';

async function loadData() {
    
    productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Mencari barang... ⏳</p>';

    
    const from = currentPage * itemsPerPage;
    const to = from + itemsPerPage - 1;

   
    let req = supabase.from('produk').select('*', { count: 'exact' });

    if (currentCategory !== 'Semua') {
        req = req.eq('kategori', currentCategory);
    }

  
    if (searchQuery !== '') {
        req = req.ilike('nama', `%${searchQuery}%`);
    }

    const { data, count, error } = await req.order('id', { ascending: false }).range(from, to);

    if (error) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:red;">Gagal memuat barang!</p>';
        return;
    }

    if (data.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Barang tidak ditemukan, bre.</p>';
        pagination.innerHTML = '';
        return;
    }

    productGrid.innerHTML = '';
    data.forEach(item => {
        productGrid.innerHTML += `
            <div class="product-card">
                <img src="${item.gambar}" alt="${item.nama}">
                <h3>${item.nama}</h3>
                <p>📂 ${item.kategori}</p>
                <a href="${item.link}" target="_blank" class="btn-beli">🛒 Cek Harga Asli</a>
            </div>
        `;
    });

    renderPagination(count);
}


function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
   
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    
    if (currentPage > 0) {
        html += `<button class="page-btn" onclick="changePage(-1)">⬅️ Prev</button>`;
    } else {
        html += `<button class="page-btn" disabled style="opacity:0.5; cursor:not-allowed;">⬅️ Prev</button>`;
    }

    html += `<span style="display:flex; align-items:center; font-weight:bold; font-size:13px; margin:0 10px;">
                Hal ${currentPage + 1} dari ${totalPages}
             </span>`;

    if (currentPage < totalPages - 1) {
        html += `<button class="page-btn" onclick="changePage(1)">Next ➡️</button>`;
    } else {
        html += `<button class="page-btn" disabled style="opacity:0.5; cursor:not-allowed;">Next ➡️</button>`;
    }

    pagination.innerHTML = html;
}

window.changePage = (direction) => {
    currentPage += direction;
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Layar otomatis scroll ke atas
};

catBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        catBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        currentCategory = e.target.getAttribute('data-cat');
        currentPage = 0; 
        loadData();
    });
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 0; 
    loadData();
});

loadData();
