# Undangan Pernikahan Digital: Afina & Wisnu

Website undangan satu halaman (HTML + Tailwind CSS CDN + JavaScript vanilla).
Tanpa build tools, tanpa Node.js. Cukup buka di VS Code dan jalankan.

## Struktur

```
undangan-afina-wisnu/
├── index.html              # kerangka halaman
├── assets/
│   ├── css/style.css       # tema warna (variabel di bagian atas), animasi
│   ├── js/
│   │   ├── config.js       # SEMUA DATA undangan: edit di sini
│   │   └── main.js         # logika: countdown, nama tamu, RSVP, musik
│   ├── img/                # foto mempelai, QRIS, favicon, gambar pratinjau
│   └── audio/              # taruh janji-suci-yovie-nuno.mp3 di sini
├── tools/link-tamu.html    # pembuat tautan per tamu (+ tombol WhatsApp)
├── _headers                # header keamanan/cache untuk Cloudflare Pages
├── robots.txt              # mencegah mesin pencari mengindeks undangan
└── .vscode/                # pengaturan & rekomendasi ekstensi VS Code
```

## Menjalankan di VS Code

1. Buka folder ini: **File > Open Folder**.
2. Pasang ekstensi yang direkomendasikan (muncul otomatis di pojok kanan bawah). Yang utama: **Live Server**.
3. Klik kanan `index.html` > **Open with Live Server**. Halaman terbuka di `http://127.0.0.1:5500`.
4. Uji nama tamu: `http://127.0.0.1:5500/?to=Budi+Santoso`

> Butuh internet saat pengembangan karena Tailwind dan Google Fonts dimuat dari CDN.

## Yang perlu Anda ganti (checklist)

- [ ] `assets/js/config.js`: alamat acara, tautan Google Maps, nomor rekening, `site.url`
- [ ] Foto: timpa `assets/img/afina.svg` dan `wisnu.svg`, atau ganti path `photo` di config dengan `.jpg` Anda (rasio persegi, sekitar 600x600 px)
- [ ] Lagu: salin file ke `assets/audio/janji-suci-yovie-nuno.mp3`
- [ ] QRIS (opsional): simpan gambarnya di `assets/img/qris.png`, lalu isi `qris: 'assets/img/qris.png'` pada item di `gifts`
- [ ] Gambar pratinjau WhatsApp: buat `assets/img/og.jpg` (1200x630), lalu aktifkan baris `og:image` di `index.html` dengan alamat lengkap situs
- [ ] Hapus `sampleWishes` di config bila tidak ingin ada ucapan contoh

## Nama tamu

Format: `https://afina-wisnu.pages.dev/?to=Budi+Santoso`
Tanpa parameter, yang tampil adalah "Tamu Undangan" (diatur di `defaultGuest`).
Untuk membuat banyak tautan sekaligus, buka `tools/link-tamu.html` lewat Live Server.
Hapus folder `tools/` sebelum publikasi bila tidak ingin alat itu ikut online.

## Lagu latar

Browser hanya mengizinkan musik diputar setelah tamu mengetuk sesuatu, karena itu musik mulai saat tombol "Buka Undangan" ditekan. Kompres file mp3 sekitar 3-5 MB agar cepat dimuat di ponsel.
Lagu ini berhak cipta. Untuk undangan pribadi yang dibagikan terbatas biasanya aman, tetapi jangan dipakai di situs komersial.

## Publikasi gratis (Cloudflare Pages, tanpa kartu)

Alamat bawaan Cloudflare Pages berakhiran **`.pages.dev`** (bukan `.page.dev`).
Nama proyek menentukan alamatnya: proyek `afina-wisnu` menjadi `afina-wisnu.pages.dev`.

**Cara 1: unggah langsung (paling mudah)**
1. Daftar/masuk di dash.cloudflare.com.
2. **Workers & Pages > Create > Pages > Upload assets**.
3. Isi nama proyek (mis. `afina-wisnu`), lalu seret seluruh isi folder ini.
4. Klik **Deploy**. Jika nama sudah dipakai orang lain, pilih nama lain atau terima akhiran yang disarankan Cloudflare.

**Cara 2: lewat GitHub (update otomatis)**
1. `git init`, commit, lalu push ke repositori GitHub.
2. Di Cloudflare: **Create > Pages > Connect to Git**, pilih repositori.
3. Build command dan output directory dikosongkan, karena situs ini statis.
4. Setiap `git push` akan memperbarui situs.

Setelah itu perbarui `site.url` di `config.js` dan alamat di `tools/link-tamu.html` bila nama proyek berbeda.
Domain pribadi bisa ditambahkan nanti lewat **Custom domains** pada proyek yang sama.

## Menyimpan RSVP secara permanen (opsional)

Secara bawaan ucapan hanya tampil di halaman dan hilang saat dimuat ulang.
Untuk menyimpannya, buat Google Apps Script web app yang menerima POST dan menulis ke Google Sheets,
lalu isi URL-nya pada `rsvpEndpoint` di `config.js`. Data dikirim dalam bentuk JSON: `{name, status, text, time}`.
Catatan: daftar ucapan di halaman tetap lokal; untuk menampilkan ucapan semua tamu, Anda perlu endpoint yang juga mengembalikan data.

## Tema

Warna ada di bagian atas `assets/css/style.css`. Tampilan terang dan gelap otomatis mengikuti perangkat tamu.
Untuk memaksa mode terang, tambahkan `data-theme="light"` pada tag `<html>` di `index.html`.
