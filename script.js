/* script.js - Global Logic */

// Fungsi navigasi sederhana
function navigateTo(url) {
    // Efek visual klik sebelum pindah
    setTimeout(() => {
        window.location.href = url;
    }, 150);
}

// Menyimpan role yang dipilih ke LocalStorage agar bisa dibaca di halaman Register
function selectRole(roleName) {
    localStorage.setItem('selectedRole', roleName);
    console.log("Role terpilih:", roleName);
    navigateTo('register.html');
}

// Mengambil role saat ini (untuk debugging)
function getCurrentRole() {
    return localStorage.getItem('selectedRole') || 'User';
}

// --- Auth & Mock DB Logic ---

// Handle Login Redirection based on Role
function handleLogin(event) {
    if (event) event.preventDefault();

    const role = getCurrentRole();
    console.log("Logging in as:", role);

    // Simpan status login
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect sesuai role
    if (role === 'Generator') {
        navigateTo('generator-dashboard.html');
    } else if (role === 'Aggregator') {
        navigateTo('aggregator-dashboard.html');
    } else if (role === 'Converter') {
        navigateTo('marketplace.html');
    } else if (role === 'Enabler') {
        navigateTo('enabler-dashboard.html');
    } else if (role === 'Buyer') {
        navigateTo('store.html');
    } else {
        // Default fallback
        navigateTo('generator-dashboard.html');
    }
}

// Mock DB: Simpan Data Limbah
function saveWasteData(wasteData) {
    // wasteData format: { type, weight, price, image, timestamp, status, lat, lng }
    let wasteList = JSON.parse(localStorage.getItem('wasteList')) || [];
    wasteList.unshift(wasteData); // Add to beginning
    localStorage.setItem('wasteList', JSON.stringify(wasteList));
}

// Mock DB: Ambil Data Limbah
function getWasteData() {
    let data = JSON.parse(localStorage.getItem('wasteList')) || [];

    // Auto-fix: Replace broken placeholders in existing data
    let modified = false;
    data = data.map(item => {
        if (item.image && item.image.includes('via.placeholder.com')) {
            item.image = 'https://images.unsplash.com/photo-1610300959477-8d89617325cc?w=100&q=80';
            modified = true;
        }
        return item;
    });

    if (modified) {
        localStorage.setItem('wasteList', JSON.stringify(data));
    }

    return data;
}

// Mock DB: Ambil Item Marketplace (Siap Jual / Diangkut)
function getMarketplaceItems() {
    const wasteList = getWasteData();
    // Assumption: Items that are 'Diangkut' are available for pre-order, or 'Siap Jual' (implied)
    // Filter out 'Terjual' and 'Menunggu Penjemputan'
    return wasteList.filter(item => ['Diangkut', 'Di Gudang', 'Siap Jual'].includes(item.status));
}

// Mock DB: Ambil Item Toko (Produk Jadi)
function getStoreProducts() {
    // Return hardcoded finished goods for now or simulated form DB
    // Added sourceWasteId to link with traceability
    return [
        {
            id: 'PROD-001',
            name: 'Kursi Santai Jati (Upcycled)',
            price: 750000,
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
            category: 'Furniture',
            rating: 4.8,
            sold: 12,
            sourceWasteId: 'INV-001' // Linked to Jati
        },
        {
            id: 'PROD-002',
            name: 'Wall Panel Akustik 3D',
            price: 450000,
            image: 'https://images.unsplash.com/photo-1620626012053-108984250390?w=400&q=80',
            category: 'Dekorasi',
            rating: 5.0,
            sold: 5,
            sourceWasteId: 'INV-002' // Linked to Mahoni
        },
        {
            id: 'PROD-003',
            name: 'Lampu Meja Ranting',
            price: 250000,
            image: 'https://images.unsplash.com/photo-1513506003013-194a5d68d878?w=400&q=80',
            category: 'Lampu',
            rating: 4.5,
            sold: 28,
            sourceWasteId: 'INV-001'
        },
        {
            id: 'PROD-004',
            name: 'Nampan Saji Kayu Mahoni',
            price: 120000,
            image: 'https://images.unsplash.com/photo-1615963244664-5b845b2025dc?w=400&q=80',
            category: 'Alat Dapur',
            rating: 4.9,
            sold: 45,
            sourceWasteId: 'INV-002'
        }
    ];
}

// Mock DB: Ambil Item Terjual (Untuk Converter & Enabler)
function getSoldItems() {
    const wasteList = getWasteData();
    return wasteList.filter(item => item.status === 'Terjual');
}

// Mock DB: Hitung Dampak
function calculateImpact() {
    const soldItems = getSoldItems();
    let totalWeight = 0;
    let totalValue = 0;

    soldItems.forEach(item => {
        totalWeight += parseInt(item.weight);
        totalValue += parseInt(item.price);
    });

    // Asumsi: 1kg kayu daur ulang menghemat 1.5kg CO2
    const co2Saved = totalWeight * 1.5;

    return {
        totalWeight,
        totalValue,
        co2Saved
    };
}

// Mock DB: Ambil Notifikasi
function getNotifications() {
    return [
        { id: 1, title: 'Limbah Dijemput', message: 'Aggregator sedang menuju lokasi Anda.', time: '10 Menit lalu', type: 'info' },
        { id: 2, title: 'Pembayaran Diterima', message: 'Saldo Rp 150.000 telah masuk ke dompet Anda.', time: '1 Jam lalu', type: 'success' },
        { id: 3, title: 'Promo Spesial', message: 'Dapatkan bonus poin untuk setoran minggu ini!', time: '1 Hari lalu', type: 'warning' }
    ];
}

// Mock DB: Ambil Transaksi Dompet
function getWalletTransactions() {
    return [
        { id: 'TRX-998', title: 'Penjualan Kayu Jati', amount: 150000, type: 'credit', date: '09 Feb 2026' },
        { id: 'TRX-999', title: 'Penarikan Dana', amount: -50000, type: 'debit', date: '08 Feb 2026' },
        { id: 'TRX-997', title: 'Penjualan Mahoni', amount: 300000, type: 'credit', date: '07 Feb 2026' }
    ];
}

// Mock DB: Ambil List Chat
function getChats() {
    return [
        { id: 1, name: 'Mas Yono (Aggregator)', message: 'Halo Pak, saya sudah di depan gudang ya.', time: 'Baru saja', unread: 2 },
        { id: 2, name: 'CS WoodLoop', message: 'Apakah ada kendala dengan aplikasi?', time: 'Kemarin', unread: 0 }
    ];
}

// Mock DB: Beli Item (Update Status ke Terjual)
function buyItem(id) {
    return updateWasteStatus(id, 'Terjual');
}

// Mock DB: Update Status Limbah
function updateWasteStatus(id, newStatus) {
    let wasteList = getWasteData();
    const index = wasteList.findIndex(item => item.id === id);
    if (index !== -1) {
        wasteList[index].status = newStatus;
        localStorage.setItem('wasteList', JSON.stringify(wasteList));
        return true;
    }
    return false;
}

// Mock DB: Data Awal (Seeding)
function seedDataIfEmpty() {
    if (!localStorage.getItem('wasteList')) {
        const dummyData = [
            {
                id: 'INV-001',
                type: 'Jati (Teak)',
                weight: '50',
                price: '150000',
                image: 'https://images.unsplash.com/photo-1610300959477-8d89617325cc?w=100&q=80',
                timestamp: new Date().getTime() - 86400000,
                status: 'Menunggu Penjemputan',
                lat: -6.5935, // Jepara coords
                lng: 110.6700
            },
            {
                id: 'INV-002',
                type: 'Mahoni',
                weight: '120',
                price: '300000',
                image: 'https://images.unsplash.com/photo-1543459176-4428b496d8dd?w=100&q=80',
                timestamp: new Date().getTime() - 200000,
                status: 'Menunggu Penjemputan',
                lat: -6.5890,
                lng: 110.6650
            }
        ];
        localStorage.setItem('wasteList', JSON.stringify(dummyData));
    }
}

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}