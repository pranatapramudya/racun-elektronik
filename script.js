import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// KTP dan Alamat Resmi
const supabaseUrl = 'https://svfaoiofpyzovkdqrsqo.supabase.co';
const supabaseKey = 'sb_publishable_LIGKz-_pNueJeC054YMMDg_PjtG1FCQ';

// Mesin Anti-Cegat Satpam
const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    }
});

const productGrid = document.getElementById('productGrid');

// Fungsi memanggil kurir untuk ambil data dari Gudang
async function loadProducts() {
    const { data, error } = await supabase.from('produk').select('*').order('id', { ascending: false });

    if (error) {
        console.error("Gagal ambil data:", error);
        productGrid.innerHTML = '<p style="text-align: center; width: 100%;">Gagal memuat produk. Coba refresh halaman.</p>';
        return;
    }

    productGrid.innerHTML = ''; 

    if (data.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; width: 100%;">Belum ada produk di etalase.</p>';
        return;
    }

    data.forEach(item => {
        productGrid.innerHTML += `
            <div class="product-card">
                <img src="${item.gambar}" alt="${item.nama}">
                <h3>${item.nama}</h3>
                <p>${item.kategori}</p>
                <a href="${item.link}" target="_blank" class="btn-beli">Lihat Produk</a>
            </div>
        `;
    });
}

// Jalankan mesin saat web dibuka
loadProducts();
