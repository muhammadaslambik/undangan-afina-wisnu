/*
  ================================================================
  SEMUA DATA UNDANGAN ADA DI SINI.
  Cukup edit file ini untuk mengganti nama, tanggal, acara, dll.
  ================================================================
*/
window.INVITATION = {
  site: {
    title: 'Undangan Pernikahan Afina & Wisnu',
    url: 'https://afina-wisnu.pages.dev/',
  },

  hero: {
    intro: 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan hari bahagia kami.',
  },

  couple: {
    bride: {
      short: 'Afina',
      full: 'Afina Syuhudi',
      role: 'Putri dari',
      parents: 'Bapak Suhudi & Ibu Saudah',
      photo: 'assets/img/afina.svg', // ganti dengan foto asli, mis. assets/img/afina.jpg
    },
    groom: {
      short: 'Wisnu',
      full: 'Wisnu Setya Wardhana',
      role: 'Putra dari',
      parents: 'Bapak Duwi Mulyono & Ibu Warniyati',
      photo: 'assets/img/wisnu.svg',
    },
  },

  date: {
    iso: '2026-11-15T08:00:00+07:00', // target countdown (WIB = +07:00)
    label: 'Minggu, 15 November 2026',
  },

  verse: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya.',
    source: 'QS. Ar-Rum: 21',
  },

  events: [
    {
      title: 'Akad Nikah',
      time: '08.00 WIB – Selesai',
      place: 'Rumah Mempelai Wanita',
      address: 'Kediaman Bapak Suhudi\n[Alamat lengkap diisi di sini]',
      mapUrl: 'https://maps.google.com', // ganti dengan tautan Google Maps lokasi
    },
    {
      title: 'Resepsi',
      time: '11.00 – 13.00 WIB',
      place: 'Rumah Mempelai Wanita',
      address: 'Kediaman Bapak Suhudi\n[Alamat lengkap diisi di sini]',
      mapUrl: 'https://maps.google.com',
    },
  ],

  health: 'Demi kenyamanan bersama, mohon tetap menjaga kebersihan tangan, mengenakan masker bila sedang kurang sehat, dan menjaga jarak yang nyaman selama acara berlangsung.',

  // Hadiah digital. Tambah/hapus item sesuai kebutuhan.
  // Untuk QRIS: isi "qris" dengan path gambar, mis. 'assets/img/qris.png'
  gifts: [
    { bank: 'Bank BCA', number: '1234567890', name: 'Afina Syuhudi', qris: null },
    { bank: 'Bank Mandiri', number: '0987654321', name: 'Wisnu Setya Wardhana', qris: null },
  ],

  footer: {
    closing: 'Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
    families: 'Dengan penuh cinta, keluarga besar Bpk. Suhudi & Bpk. Duwi Mulyono',
  },

  music: 'assets/audio/janji-suci-yovie-nuno.mp3', // letakkan file mp3 Anda dengan nama ini di assets/audio/
  musicTitle: 'Janji Suci - Yovie & Nuno',
  defaultGuest: 'Tamu Undangan',

  // Opsional: URL Google Apps Script / webhook untuk menyimpan RSVP secara permanen.
  // Kosongkan untuk mode demo (ucapan hanya tersimpan di halaman).
  rsvpEndpoint: '',

  sampleWishes: [
    { name: 'Keluarga Besar', status: 'Hadir', text: 'Semoga menjadi keluarga sakinah, mawaddah, warahmah.', time: 'Contoh' },
    { name: 'Sahabat Kuliah', status: 'Hadir', text: 'Selamat menempuh hidup baru, semoga bahagia selalu!', time: 'Contoh' },
  ],
};
