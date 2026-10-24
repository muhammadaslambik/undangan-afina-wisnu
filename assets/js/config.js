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
      full: 'Afina Syuhudi, S.Psi.',
      role: 'Putri dari',
      parents: 'Bapak Suhudi & Ibu Saudah',
      photo: 'assets/img/profil-afina.jpg?v=3',
    },
    groom: {
      short: 'Wisnu',
      full: 'Wisnu Setya Wardhana, S.Pd.',
      role: 'Putra dari',
      parents: 'Bapak Duwi Mulyono & Ibu Warniyati',
      photo: 'assets/img/profil-wisnu.jpg?v=3',
    },
  },

  date: {
    iso: '2026-11-15T09:00:00+07:00', // target countdown (WIB = +07:00), mengikuti awal akad
    label: 'Ahad, 15 November 2026',
  },

  verse: {
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ',
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
    source: 'QS. Ar-Rum: 21',
  },

  events: [
    {
      title: 'Akad Nikah',
      time: '09.00 WIB – 11.00 WIB',
      place: 'Rumah Mempelai Wanita',
      address: 'Ds. Loireng, Kec. Sayung, Kab. Demak, RT: 02/RW: 02, Jawa Tengah.',
      mapUrl: 'https://maps.app.goo.gl/vB1MUiRTvxw3Rq5v5?g_st=am',
    },
    {
      title: 'Resepsi',
      time: '11.00 – Selesai',
      place: 'Rumah Mempelai Wanita',
      address: 'Ds. Loireng, Kec. Sayung, Kab. Demak, RT: 02/RW: 02, Jawa Tengah.',
      mapUrl: 'https://maps.app.goo.gl/vB1MUiRTvxw3Rq5v5?g_st=am',
    },
  ],

  health: 'Demi kenyamanan bersama, mohon tetap menjaga kebersihan tangan, mengenakan masker bila sedang kurang sehat, dan menjaga jarak yang nyaman selama acara berlangsung.',

  // Hadiah digital. Tambah/hapus item sesuai kebutuhan.
  // Untuk QRIS: isi "qris" dengan path gambar, mis. 'assets/img/qris.png'
  gifts: [
    { bank: 'Bank BTN', number: '20601610034869', name: 'Afina Syuhudi', qris: null },
  ],

  footer: {
    closing: 'Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
    families: 'Dengan penuh cinta, keluarga besar Bpk. Suhudi & Bpk. Duwi Mulyono',
  },

  music: 'assets/audio/janji-suci-yovie-nuno.mp3',
  musicTitle: 'Janji Suci - Yovie & Nuno',
  defaultGuest: 'Tamu Undangan',

  // DATABASE UCAPAN: tempel URL "Web app" dari Google Apps Script di antara tanda kutip.
  // Contoh: 'https://script.google.com/macros/s/XXXXXXXX/exec'
  // Kosongkan untuk mode demo (ucapan hanya tersimpan di halaman).
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbwH01-gCNH3vSIj3X3J8Kl1axCrvnAswYZveS4rHG9N9g5qVY0RuqHG7ejzz9WAr2T7gg/exec',

  sampleWishes: [
    { name: 'Keluarga Besar', status: 'Hadir', text: 'Semoga menjadi keluarga sakinah, mawaddah, warahmah.', time: 'Contoh' },
    { name: 'Sahabat Kuliah', status: 'Hadir', text: 'Selamat menempuh hidup baru, semoga bahagia selalu!', time: 'Contoh' },
  ],
};
