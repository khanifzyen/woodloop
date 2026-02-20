# WoodLoop Screen Implementation Plan
**Date:** 20 Februari 2026
**Status:** Perencanaan (Planning)

Dokumen ini memetakan seluruh layar yang telah didesain di platform *Stitch* (dengan ID `11799467262675990044`) dan membandingkannya dengan kebutuhan yang tercantum dalam *Product Requirement Document (PRD)*. Tujuannya adalah untuk mengidentifikasi fungsionalitas yang masih perlu didesain atau diimplementasikan secara mandiri.

---

## 1. Daftar Layar dari Stitch (Dikelompokkan Berdasarkan Fitur/Role)

Berdasarkan hasil analisis, layar-layar yang diimpor dari Stitch telah dibagi ke dalam folder fitur (*features*) yang disarankan untuk arsitektur aplikasi (*Feature-First Clean Architecture*):

### 🔑 1.1 Core Authentication & Onboarding (`feature_auth`)
*   Splash Screen Branding (`dbf52f3ae27d44058c006c7f3c0c83a1`)
*   Onboarding: Digitalize Waste (`1ad18b344e124604865890926380e59b`)
*   Onboarding: Smart Logistics (`79bfd70688f141c28be2cc4a91da875a`)
*   Onboarding: Traceable Impact (`715abe24fbcb4a14bec983b4b7680d68`)
*   Welcome & Role Selection (`dbd5348091114ff88e5cebfe91a16800`)
*   WoodLoop Secure Login (`a4c2987dacd44178a844f61beed14f59`)
*   Forgot Password Recovery (`4a451276c8134967b9feab54f5f8d0ec`)

### 🪵 1.2 Supplier Flow (`feature_supplier`)
*   Supplier Registration (`ea03ee2724fe4952b67bb80036d42adb`)
*   Supplier Dashboard (`20047f3b12ff4a81bf4b5e769514bf90`)
*   List Raw Timber Form (`7068d661542f4ef88e12d16974c801a8`)
*   Supplier Sales History (`2e4570213f484fbca897bfc5fddca98c`)

### 🪚 1.3 Generator Flow (`feature_generator`)
*   Generator Registration (`d582d88fd15940e6b504ad67ad48f142`)
*   Generator Dashboard **(Ada 3 Layar Duplikat: `7a8a3b99347f43868072baf72be516d2`, `9aed3cd90de54c1ab510994442b2a1c8`, `d7fe25a5b6f44372acdbd4c2bd5d9ef9`)**
*   Report Wood Waste (`bf55e01cee0c4217bc36fd29afa61190`)
*   Generator Order Management (`6fcb3577b72a49c7805e1da4b1bddf7d`)

### 🚚 1.4 Aggregator Flow (`feature_aggregator`)
*   Aggregator Registration (`7c3be43277d546288b35d1c5a8313fed`)
*   Aggregator Dashboard Overview (`386f004707004d49a50f5126e9733ad9`)
*   Aggregator Treasure Map **(Ada 2 Layar Duplikat: `752b616521bc458681dafd4a1bdb1293`, `e92ee31f5729414a84a391638f9d45c4`)**
*   Confirm Pickup Collection (`6047a033751d474d8eb479c7c9d13b57`)
*   Warehouse Inventory Log (`30d56a555a8f40b2ad862d54fc7d5a56`)

### ♻️ 1.5 Converter Flow (`feature_converter`)
*   Converter Registration (`cf2aa5c328574bf69c95ce948b273ce8`)
*   Converter Studio Dashboard (`c43d63a37ce34794947b12f04638636b`)
*   Waste Materials Marketplace (`b1e94e76ae314ba0a9d02d308e5662b7`)
*   Raw Timber Marketplace (`d93725ea240e445f928dbdc7e0538e94`)
*   B2B Waste Marketplace (`4ddd530f79234a70a7ca54610f234cce`)
*   Design Clinic & Inspiration (`73f32190b90c4ff4a4b81270b24133a4`)
*   My Upcycled Catalog (`795549025c434ff28f057af033bf4bc1`)
*   Create Upcycled Product (`d5dd0804e96a4c169ac099fe52f5d851`)

### 🛒 1.6 Buyer Flow (`feature_buyer`)
*   Buyer Registration (`b0ad0dac17a945e2b2fb2f0b59624439`)
*   Buyer Profile & Impact Dashboard (`1524f7e383a34499938b092901b97fac`)
*   Upcycled Products Marketplace (`96553d5d7baa4b20a199575779bab550`)
*   Marketplace Category Hub (`c0a1b7b418754017a9a6e1f72bb64dec`)
*   Your Shopping Cart (`3de9815b64ba4997b88ef372a7d57e67`)
*   Secure Checkout & Payment (`ee90da6c83c7418eb8ef7f480af3f883`)
*   Order Tracking & Journey (`1e8d147d3c2b4e3c88a965c126c3f1a2`)

### 📊 1.7 Enabler Flow (`feature_enabler`)
*   Impact Analytics Dashboard (`5aee7761704944c19582afe4af8e3e76`)

### 🌐 1.8 Shared / Cross-Role Features
*   **Messaging (`feature_chat`)**
    *   Messages List (`8defdd39626447f58b51975bb8325bec`)
    *   Direct Message Conversation (`0d9f4dd25fbd485d909def6f0323d389`)
*   **Traceability (`feature_traceability`)**
    *   Select Wood Source History (`cc4a251d0e884f169f019d8875d47f6e`)
    *   Product Story & Traceability (`561f8f7f15064a4fb7b7c79ef478372e`)
*   **Profile (`feature_profile`)**
    *   Designer & Consultant Profile (`6bf3e7847b784d0eb37335af6b1ac643`)
*   **Wallet & Notifications (`feature_shared`)**
    *   Notification Center (`397db4c5762b47a9919d67407ef5bd55`)
    *   WoodLoop Digital Wallet (`b258e36a08bc4ea7a69d8ff06697fe11`)

---

## 2. Pemenuhan PRD (Kelengkapan Layar)

Berdasarkan perbandingan dengan `docs/04-prd.md`, **Desain prototipe di Stitch saat ini (45 layar) telah berhasil memenuhi seluruh alur operasional utama** yang sebelumnya hilang.

*   ✅ **Supplier Flow Terpenuhi:** Dashboard Supplier, List Raw Timber, dan Sales History sudah tersedia.
*   ✅ **Aggregator Flow Terpenuhi:** Dashboard Aggregator, form konfirmasi Pickup, dan Warehouse Inventory (Gudang) sudah tersedia.
*   ✅ **Converter Flow Terpenuhi:** Converter Dashboard, Design Clinic, My Upcycled Catalog, dan Create Product untuk QR Code telah ditambahkan.
*   ✅ **Buyer Flow Terpenuhi:** Buyer Profile, Secure Checkout & Payment, serta Order Tracking telah melengkapi ekosistem pembelian e-commerce.
*   ✅ **Shared Features Terpenuhi:** Notification Center dan Digital Wallet telah ditambahkan dan menutupi kebutuhan interaksi lintas peran.

Dengan kelengkapan 45 layar ini, pengembangan *frontend* (Flutter Prototype) dapat dilanjutkan secara mandiri tanpa ada *blind-spot* fungsional dari sisi desain.

---

## 3. Langkah Selanjutnya
Membangun prototipe *Flutter* menggunakan struktur ini menggunakan *mock data*. Layar-layar utama yang telah ada akan menjadi prioritas, semenjak fungsionalitas layar yang hilang dapat dibangun mengikuti bahasa desain struktural yang serupa menggunakan blok-blok modular (*widgets*).
