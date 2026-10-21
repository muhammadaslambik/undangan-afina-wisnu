(() => {
  'use strict';
  const C = window.INVITATION;
  const $ = (s) => document.querySelector(s);
  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  const el = (tag, cls = '', text = '') => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  /* ---------- Kunci: isi undangan tersembunyi sampai tombol ditekan ---------- */
  const lockPage = () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.classList.add('locked');
  };
  const unlockPage = () => document.documentElement.classList.remove('locked');
  lockPage();

  /* ---------- Toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg; t.style.opacity = 1;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.style.opacity = 0), 2200);
  };

  /* ---------- Isi teks dari config ---------- */
  const bindText = () => {
    document.title = C.site.title;
    document.querySelectorAll('[data-bind]').forEach((n) => {
      const v = get(C, n.dataset.bind);
      if (v != null) n.textContent = v;
    });
  };

  /* ---------- Render bagian dinamis ---------- */
  const renderCouple = () => {
    const grid = $('#coupleGrid');
    [C.couple.bride, C.couple.groom].forEach((p) => {
      const box = el('div', 'reveal');
      const ring = el('div', 'mx-auto w-48 h-48 rounded-full p-1.5 gold-border');
      const inner = el('div', 'w-full h-full rounded-full overflow-hidden');
      inner.style.background = 'var(--sage)';
      const img = el('img', 'w-full h-full object-cover');
      img.src = p.photo; img.alt = 'Foto ' + p.full; img.loading = 'lazy';
      inner.append(img); ring.append(inner);
      const name = el('h3', 'font-serif text-3xl font-semibold mt-6', p.full);
      const par = el('p', 'mt-2 text-sm leading-relaxed');
      par.style.color = 'var(--muted)';
      par.append(p.role, document.createElement('br'), p.parents);
      box.append(ring, name, par);
      grid.append(box);
    });
  };

  const renderEvents = () => {
    const grid = $('#eventsGrid');
    C.events.forEach((ev) => {
      const card = el('article', 'card p-8 text-center reveal');
      const h = el('h3', 'font-serif text-3xl font-semibold', ev.title); h.style.color = 'var(--sage-d)';
      const div = el('div', 'divider my-4'); div.append(el('span', '', '✦'));
      const time = el('p', 'font-serif text-2xl', ev.time);
      const place = el('p', 'mt-4 font-medium', ev.place);
      const addr = el('p', 'text-sm mt-1 leading-relaxed');
      addr.style.color = 'var(--muted)';
      ev.address.split('\n').forEach((line, i) => { if (i) addr.append(document.createElement('br')); addr.append(line); });
      const a = el('a', 'btn-line inline-block mt-6 px-6 py-2.5 text-sm', 'Lihat Peta Lokasi');
      a.href = ev.mapUrl; a.target = '_blank'; a.rel = 'noopener';
      card.append(h, div, time, place, addr, a);
      grid.append(card);
    });
  };

  const fmtNumber = (n) => n.replace(/(\d{4})(?=\d)/g, '$1 ');
  const renderGifts = () => {
    const grid = $('#giftGrid');
    C.gifts.forEach((g) => {
      const card = el('div', 'card gold-border p-6 reveal');
      const bank = el('p', 'font-serif text-xl font-semibold', g.bank); bank.style.color = 'var(--sage-d)';
      card.append(bank);
      if (g.qris) {
        const q = el('img', 'mx-auto mt-3 w-44 h-44 object-contain rounded-lg bg-white p-2');
        q.src = g.qris; q.alt = 'QRIS ' + g.bank; q.loading = 'lazy';
        card.append(q);
      }
      if (g.number) {
        card.append(el('p', 'font-serif text-2xl tracking-wider mt-3', fmtNumber(g.number)));
      }
      const owner = el('p', 'text-sm mt-1', 'a.n. ' + g.name); owner.style.color = 'var(--muted)';
      card.append(owner);
      if (g.number) {
        const btn = el('button', 'btn-line mt-5 px-5 py-2 text-sm', 'Salin nomor');
        btn.type = 'button';
        btn.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(g.number); toast('Nomor rekening disalin'); }
          catch (e) { toast('Salin manual: ' + g.number); }
        });
        card.append(btn);
      }
      grid.append(card);
    });
  };

  /* ---------- Nama tamu: ?to=Nama+Tamu atau #Nama_Tamu ---------- */
  const readGuest = () => {
    let raw = new URLSearchParams(location.search).get('to');
    if (!raw && location.hash.length > 1) {
      try { raw = decodeURIComponent(location.hash.slice(1)).replace(/[_-]+/g, ' '); } catch (e) { raw = ''; }
    }
    raw = (raw || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    if (!raw) return C.defaultGuest;
    return raw === raw.toLowerCase() ? raw.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : raw;
  };
  const applyGuest = () => {
    const name = readGuest();
    $('#guestName').textContent = name;
    const input = $('#nama');
    if (!input.value || input.dataset.auto === '1') {
      input.value = name === C.defaultGuest ? '' : name;
      input.dataset.auto = '1';
    }
  };

  /* ---------- Musik ---------- */
  const bgm = $('#bgm');
  $('#musicBtn').title = C.musicTitle || 'Musik';
  const setIcon = (on) => { $('#icPlay').classList.toggle('hidden', on); $('#icPause').classList.toggle('hidden', !on); };
  bgm.preload = 'auto';
  bgm.volume = 0.7;
  bgm.src = C.music;
  bgm.addEventListener('play', () => { setIcon(true); disarmFirstTap(); });
  bgm.addEventListener('pause', () => setIcon(false));

  const playMusic = async (quiet = false) => {
    try { await bgm.play(); return true; }
    catch (e) { if (!quiet) toast('Ketuk layar untuk memutar musik'); return false; }
  };

  // Cadangan: mulai pada interaksi pertama di mana pun (kecuali tombol musik)
  const tapEvents = ['pointerup', 'touchend', 'click', 'keydown'];
  const onFirstTap = (e) => {
    if (e.target.closest && e.target.closest('#musicBtn')) return;
    playMusic(true);
  };
  function disarmFirstTap() { tapEvents.forEach((ev) => document.removeEventListener(ev, onFirstTap)); }
  function armFirstTap() { tapEvents.forEach((ev) => document.addEventListener(ev, onFirstTap, { passive: true })); }

  // Upaya 1: putar otomatis. Upaya 2: tunggu ketukan pertama.
  playMusic(true).then((ok) => { if (!ok) armFirstTap(); });

  /* ---------- Countdown ---------- */
  const target = new Date(C.date.iso).getTime();
  const pad = (n) => String(n).padStart(2, '0');
  let timer;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['d', 'h', 'm', 's'].forEach((k) => ($('#cd-' + k).textContent = '00'));
      const m = $('#cd-msg'); m.textContent = 'Hari bahagia telah tiba'; m.classList.remove('hidden');
      clearInterval(timer); return;
    }
    $('#cd-d').textContent = pad(Math.floor(diff / 864e5));
    $('#cd-h').textContent = pad(Math.floor(diff / 36e5) % 24);
    $('#cd-m').textContent = pad(Math.floor(diff / 6e4) % 60);
    $('#cd-s').textContent = pad(Math.floor(diff / 1e3) % 60);
  };

  /* ---------- Animasi scroll ---------- */
  const observeReveal = () => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
  };

  /* ---------- RSVP & ucapan ---------- */
  const wishes = [...C.sampleWishes];
  const renderWishes = (animateFirst = false) => {
    const list = $('#wishList');
    list.innerHTML = '';
    wishes.forEach((w, i) => {
      const li = el('li', 'card p-4' + (animateFirst && i === 0 ? ' wish-in' : ''));
      const head = el('div', 'flex items-center justify-between gap-2');
      const badge = el('span', 'text-xs px-2.5 py-1 rounded-full', w.status);
      badge.style.cssText = w.status === 'Hadir' ? 'background:var(--sage-l);color:var(--sage-d)' : 'background:var(--line);color:var(--muted)';
      head.append(el('strong', 'font-serif text-lg', w.name), badge);
      const t = el('p', 'text-xs mt-2', w.time); t.style.color = 'var(--muted)';
      li.append(head, el('p', 'text-sm mt-1.5 leading-relaxed', w.text), t);
      list.append(li);
    });
    $('#wishCount').textContent = wishes.length + ' ucapan';
  };

  const sendToServer = (data) => {
    if (!C.rsvpEndpoint) return;
    fetch(C.rsvpEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) }).catch(() => {});
  };

  const initRsvp = () => {
    $('#nama').addEventListener('input', (e) => (e.target.dataset.auto = '0'));
    $('#rsvpForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#nama').value.trim(), text = $('#ucapan').value.trim();
      const status = document.querySelector('input[name="hadir"]:checked').value;
      const err = $('#formErr');
      if (!name || !text) {
        err.textContent = 'Isi nama dan ucapan terlebih dahulu.'; err.classList.remove('hidden'); return;
      }
      err.classList.add('hidden');
      const time = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      const entry = { name, status, text, time };
      wishes.unshift(entry);
      renderWishes(true);
      sendToServer(entry);
      e.target.reset();
      $('#wishList').scrollTop = 0;
      toast('Ucapan terkirim. Terima kasih!');
    });
  };

  /* ---------- Mulai ---------- */
  bindText();
  renderCouple();
  renderEvents();
  renderGifts();
  applyGuest();
  window.addEventListener('hashchange', applyGuest);
  renderWishes();
  initRsvp();
  tick(); timer = setInterval(tick, 1000);
  observeReveal();

  $('#musicBtn').addEventListener('click', () => (bgm.paused ? playMusic() : bgm.pause()));
  $('#openBtn').addEventListener('click', () => {
    playMusic();
    unlockPage();
    requestAnimationFrame(() => $('#content').scrollIntoView({ behavior: 'smooth' }));
  });
})();