import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ==========================================
// 1. SETUP SUPABASE 
// ==========================================
const supabaseUrl = 'https://svfaoiofpyzovkdqrsqo.supabase.co';
const supabaseKey = 'sb_publishable_LIGKz-_pNueJeC054YMMDg_PjtG1FCQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. VARIABEL GLOBAL & ELEMEN DOM
// ==========================================
let allProducts = []; 
let currentCategory = 'Semua';

const gridContainer = document.getElementById('product-grid');
const searchInput = document.getElementById('searchInput');

// ==========================================
// 3. READ: MENGAMBIL DATA DARI SUPABASE
// ==========================================
async function fetchProducts() {
    // Efek loading saat data diambil dari Supabase
    gridContainer.innerHTML = '<p style="text-align:center; padding:2rem; width: 100%;">Merapikan etalase... ⏳</p>';
    
    const { data, error } = await supabase
        .from('produk') 
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        gridContainer.innerHTML = `<p style="text-align:center; color:red; width: 100%;">Gagal memuat barang: ${error.message}</p>`;
        return;
    }

    allProducts = data; 
    runFilter(); 
}

// ==========================================
// 4. RENDER HTML (TANPA TOMBOL ADMIN)
// ==========================================
function renderHTML(items) {
    gridContainer.innerHTML = '';
    
    if (items.length === 0) {
        gridContainer.innerHTML = `<div style="text-align:center; padding: 3rem 1rem; width: 100%;"><p style="color:#6b7280;">Yah, barangnya nggak ketemu 😭</p></div>`;
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `product-${product.id}`;

        card.innerHTML = `
            <img src="${product.gambar}" alt="${product.nama}" loading="lazy">
            <div class="card-content">
                <span class="badge-no">Produk No. ${product.id}</span>
                <h3>${product.nama}</h3>
                <a href="${product.link}" target="_blank" class="btn-buy">🛒 Cek Produk Sekarang</a>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// ==========================================
// 5. LOGIKA PENCARIAN & FILTER
// ==========================================
function runFilter() {
    const searchText = searchInput.value.toLowerCase().trim();
    
    const filtered = allProducts.filter(product => {
        const matchCategory = currentCategory === 'Semua' || product.kategori === currentCategory;
        const matchSearch = product.nama.toLowerCase().includes(searchText) || product.id.toString() === searchText;
        return matchCategory && matchSearch;
    });

    renderHTML(filtered);

    // Otomatis scroll & sorot jika hasil cuma 1 (pencarian nomor produk)
    if (filtered.length === 1 && searchText !== '') {
        const targetId = `product-${filtered[0].id}`;
        setTimeout(() => {
            const el = document.getElementById(targetId);
            if(el) {
                const headerHeight = document.querySelector('.sticky-header').offsetHeight;
                const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                
                el.classList.remove('highlight');
                void el.offsetWidth; 
                el.classList.add('highlight');
            }
        }, 100);
    }
}

// Event Listeners
searchInput.addEventListener('input', runFilter);

window.filterCategory = function(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) {
        btnElement.classList.add('active');
        btnElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    runFilter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ambil data pertama kali saat web dibuka
fetchProducts();
