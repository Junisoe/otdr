# OTDR SOR File Generator & Editor

🎉 **Web-based tool untuk membuat dan mengedit file SOR (Standardized OTDR Format) dengan mudah!**

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Instalasi](#-instalasi)
- [Cara Menggunakan](#-cara-menggunakan)
- [Dokumentasi](#-dokumentasi)
- [Support](#-support)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

### 🆕 Buat SOR Baru
- Input lengkap semua parameter OTDR
- Form validation otomatis
- Preview data sebelum generate
- Download file binary SOR
- Support untuk berbagai konfigurasi

### ✏️ Edit File SOR
- Upload file SOR existing
- Drag & drop support
- Edit parameter (Cable ID, Operator, Lokasi, Comment)
- Update dan download file
- Parse file SOR otomatis

### 📋 Template Preset
- 5 template standar industry
- Anritsu MT9090A (Standard & Extended)
- High Resolution (1550nm)
- Long Range (100km)
- Standard Test
- Mudah dikustomisasi

### 📚 Bantuan Komprehensif
- Dokumentasi lengkap
- Penjelasan setiap parameter
- Tips & trik penggunaan
- Troubleshooting guide
- Privacy & security info

### 🎨 User Interface Modern
- Gradient design yang menarik
- Responsive (mobile & desktop)
- Smooth animations
- Intuitive navigation
- Dark & light optimized

### 🔒 Privacy First
- ✅ Semua processing di client-side
- ✅ Tidak ada data dikirim ke server
- ✅ Aman untuk data confidential
- ✅ Bekerja offline

---

## 📦 Instalasi

### Quick Start

```bash
# Clone repository
git clone https://github.com/junisoe/otdr.git
cd otdr

# Buka di browser (langsung)
open index.html

# Atau gunakan local server
python -m http.server 8000
# Akses: http://localhost:8000
```

### Requirements
- Browser modern (Chrome, Firefox, Safari, Edge)
- Tidak perlu instalasi library tambahan
- Zero dependencies!

---

## 🚀 Cara Menggunakan

### 1️⃣ Membuat SOR Baru

```
1. Buka tab "Buat SOR Baru"
2. Isi semua field yang diperlukan (*)
3. Konfigurasi OTDR settings
4. Masukkan informasi kabel
5. Tentukan lokasi awal & akhir
6. Tambahkan event (optional)
7. Klik "Preview Data" untuk preview
8. Klik "Generate & Download SOR"
9. File akan otomatis ter-download
```

### 2️⃣ Mengedit File SOR Existing

```
1. Buka tab "Edit SOR"
2. Drag & drop file .sor atau klik untuk memilih
3. Form akan terisi otomatis
4. Edit parameter yang diinginkan
5. Klik "Update & Download SOR"
6. File ter-update akan ter-download
```

### 3️⃣ Menggunakan Template

```
1. Buka tab "Template Preset"
2. Pilih template yang sesuai
3. Form akan terisi otomatis
4. Modifikasi jika diperlukan
5. Generate & Download
```

---

## 📖 Dokumentasi

### Parameter OTDR

| Parameter | Deskripsi | Range |
|-----------|-----------|-------|
| Wavelength | Frekuensi cahaya | 1310, 1550, 1625 nm |
| Pulse Width | Lebar pulsa | 0.3 - 100 m |
| Range | Jarak ukur maksimal | 1 - 100+ km |
| Resolution | Ketelitian jarak | 0.1 - 10 m |
| Attenuation Rate | Redaman fiber | 0.1 - 1 dB/km |

### Fiber Types

- **SMF (Single Mode Fiber)**
  - Untuk jarak jauh
  - Attenuation rendah (~0.35 dB/km @ 1550nm)
  - Diameter core kecil (8-10 µm)

- **MMF (Multi Mode Fiber)**
  - Untuk jarak pendek/medium
  - Attenuation lebih tinggi
  - Diameter core besar (50-62.5 µm)

### Standar Attenuation Rate

| Tipe | Wavelength | Attenuation |
|-----|-----------|-------------|
| SMF | 1310 nm | ~0.35 dB/km |
| SMF | 1550 nm | ~0.20 dB/km |
| MMF | 850 nm | ~2.5 dB/km |
| MMF | 1310 nm | ~1.0 dB/km |

---

## 🎯 Contoh Penggunaan

### Contoh 1: Anritsu Standard Configuration

```
Wavelength: 1310 nm
Pulse Width: 10 m
Range: 50 km
Fiber Type: SMF
Attenuation Rate: 0.35 dB/km
Data Points: 5,000
```

### Contoh 2: Long Distance Measurement

```
Wavelength: 1550 nm
Pulse Width: 30 m
Range: 100 km
Fiber Type: SMF
Attenuation Rate: 0.20 dB/km
Data Points: 10,000
```

### Contoh 3: High Resolution Test

```
Wavelength: 1550 nm
Pulse Width: 0.3 m
Range: 10 km
Fiber Type: SMF
Attenuation Rate: 0.20 dB/km
Data Points: 10,000
```

---

## 🔧 Struktur Project

```
otdr/
├── index.html              # Main UI
├── README.md              # Documentation
├── SETUP.md              # Setup guide
├── css/
│   └── style.css         # Styling
├── js/
│   ├── app.js            # Main app
│   ├── sor-generator.js  # SOR generator
│   ├── sor-parser.js     # SOR parser
│   └── sor-utils.js      # Utilities
└── lib/
    └── presets/
        └── anritsu.json  # Anritsu presets
```

---

## 💡 Tips & Trik

1. **Naming Convention**: Gunakan format konsisten untuk Cable ID
   - Contoh: `CORE-001`, `CROSS-A01`, `TEST-LDN-BJK`

2. **Backup File Original**: Selalu backup file SOR sebelum edit

3. **Preview Terlebih Dahulu**: Cek preview data sebelum generate

4. **Use Templates**: Template menghemat waktu input

5. **Check Resolution**: Pastikan resolution sesuai dengan range

---

## ⚠️ Troubleshooting

### File tidak bisa di-upload
- Pastikan format file SOR yang benar
- Coba file dari Anritsu atau tools sejenis
- Cek console browser untuk error detail

### Data points tidak sesuai
- Preview hanya menampilkan 20 data points pertama
- File actual berisi semua data sesuai konfigurasi

### Error saat generate
- Pastikan semua field required (*) sudah diisi
- Buka F12 → Console untuk melihat error detail
- Refresh halaman jika perlu

---

## 🔒 Privacy & Security

✅ **Data Processing**
- Semua proses dilakukan di browser (client-side)
- Tidak ada data yang dikirim ke server
- File diproses secara lokal

✅ **Safe Usage**
- Aman untuk data sensitif/confidential
- Dapat digunakan offline
- Kompatibel dengan corporate network

---

## 📞 Support & Feedback

- 🐛 **Report Bug**: Buat issue di GitHub
- 💡 **Saran Fitur**: Diskusi di GitHub Discussions
- 📧 **Contact**: Via GitHub Issues

Repository: https://github.com/junisoe/otdr

---

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan apapun

---

## 🎓 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## ✨ Fitur Mendatang

- [ ] Export ke CSV/Excel
- [ ] Multiple file batch processing
- [ ] Advanced chart visualization
- [ ] Cloud storage integration
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts

---

**Last Updated**: 2026-05-21

**Made with ❤️ by Junisoe**