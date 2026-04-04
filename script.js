import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// KTP Publik (Aman ditaruh di depan)
const supabaseUrl = 'https://svfaoiofpyzovkdqrsqo.supabase.co';
const supabaseKey = 'sb_publishable_LIGKz-_pNueJeC054YMMDg_PjtG1FCQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const productGrid = document.getElementById('productGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const catBtns = document.querySelectorAll('.cat-btn');

// --- PENGATURAN HALAMAN (PAGINATION) ---
let currentPage = 0;
const itemsPerPage = 8; // Jumlah barang per halaman (bebas lu ganti)
let currentCategory = 'Semua';
let searchQuery = '';

async function loadData() {
    // Kasih efek loading biar pro
    productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Mencari barang... ⏳</p>';

    // Rumus Matematika Halaman
    const from = currentPage * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Siapin instruksi ke Satpam Supabase (Minta barang + Total jumlahnya)
    let req = supabase.from('produk').select('*', { count: 'exact' });

    // Filter 1: Kategori
    if (currentCategory !== 'Semua') {
        req = req.eq('kategori', currentCategory);
    }

    // Filter 2: Kotak Pencarian
    if (searchQuery !== '') {
        req = req.ilike('nama', `%${searchQuery}%`);
    }

    // Eksekusi: Ambil barang sesuai halaman
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

    // Render / Tampilkan Barang ke Layar
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

    // Render Tombol Halaman
    renderPagination(count);
}

// --- FUNGSI MENGGAMBAR TOMBOL HALAMAN ---
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Kalau barangnya dikit (cuma 1 halaman), gak usah ada tombol
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    
    // Tombol Prev (Mundur)
    if (currentPage > 0) {
        html += `<button class="page-btn" onclick="changePage(-1)">⬅️ Prev</button>`;
    } else {
        html += `<button class="page-btn" disabled style="opacity:0.5; cursor:not-allowed;">⬅️ Prev</button>`;
    }

    // Info Halaman
    html += `<span style="display:flex; align-items:center; font-weight:bold; font-size:13px; margin:0 10px;">
                Hal ${currentPage + 1} dari ${totalPages}
             </span>`;

    // Tombol Next (Maju)
    if (currentPage < totalPages - 1) {
        html += `<button class="page-btn" onclick="changePage(1)">Next ➡️</button>`;
    } else {
        html += `<button class="page-btn" disabled style="opacity:0.5; cursor:not-allowed;">Next ➡️</button>`;
    }

    pagination.innerHTML = html;
}

// --- AKSI PINDAH HALAMAN ---
window.changePage = (direction) => {
    currentPage += direction;
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Layar otomatis scroll ke atas
};

// --- AKSI FILTER KATEGORI ---
catBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Pindah warna tombol aktif
        catBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Atur ulang pencarian
        currentCategory = e.target.getAttribute('data-cat');
        currentPage = 0; // Balik ke halaman 1 tiap ganti kategori
        loadData();
    });
});

// --- AKSI KOTAK PENCARIAN ---
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 0; // Balik ke halaman 1 tiap ngetik
    loadData();
});

// Panggilan pertama saat web dibuka
loadData();
