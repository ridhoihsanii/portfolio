(function (root) {
  'use strict';

  const indonesian = {
    'Rabbani Ridho Ihsani — Portfolio': 'Rabbani Ridho Ihsani — Portofolio',
    'About': 'Tentang',
    'Skills': 'Keahlian',
    'Experience': 'Pengalaman',
    'Projects': 'Proyek',
    '🦕Dino Game': '🦕Permainan Dino',
    'Contact': 'Kontak',
    'Toggle dark mode': 'Ganti mode terang atau gelap',
    'Toggle menu': 'Buka atau tutup menu',
    'Language': 'Bahasa',
    "👋 Hello, I'm": '👋 Halo, saya',
    'I build': 'Saya membangun',
    'Backend Systems': 'Sistem Backend',
    'RESTful APIs': 'RESTful API',
    'Event-Driven Systems': 'Sistem Berbasis Peristiwa',
    'Warehouse Systems': 'Sistem Pergudangan',
    'Java Backend Engineer with 4+ years of experience at PT Tri Adi Bersama (Anteraja). I build Java and Spring Boot services, RESTful APIs, and Redis- and Kafka-based workflows for warehouse operations. I also built a timesheet reporting tool that integrates with Odoo.': 'Java Backend Engineer dengan pengalaman lebih dari 4 tahun di PT Tri Adi Bersama (Anteraja). Saya membangun layanan Java dan Spring Boot, RESTful API, serta alur kerja berbasis Redis dan Kafka untuk operasional gudang. Saya juga membuat alat pelaporan timesheet yang terintegrasi dengan Odoo.',
    'Get In Touch': 'Hubungi Saya',
    'View CV': 'Lihat CV',
    'Years Experience': 'Tahun Pengalaman',
    'Scroll down': 'Gulir ke bawah',
    'Who I Am': 'Siapa Saya',
    'About Me': 'Tentang Saya',
    'Java Backend Engineer at': 'Java Backend Engineer di',
    "I'm Rabbani Ridho Ihsani, a Java Backend Engineer with 4+ years of professional experience at PT Tri Adi Bersama (Anteraja), building backend services for warehouse operational systems. My work focuses on Java, Spring Boot, and RESTful APIs.": 'Saya Rabbani Ridho Ihsani, Java Backend Engineer dengan pengalaman profesional lebih dari 4 tahun di PT Tri Adi Bersama (Anteraja), membangun layanan backend untuk sistem operasional gudang. Pekerjaan saya berfokus pada Java, Spring Boot, dan RESTful API.',
    'I implement Redis caching and queue mechanisms and develop Kafka producers and consumers for event-driven processing. I also built an Odoo-integrated tool for reporting my completed tasks, write unit tests with JUnit and Mockito, and help resolve production issues.': 'Saya menerapkan cache dan antrean Redis serta mengembangkan producer dan consumer Kafka untuk pemrosesan berbasis peristiwa. Saya juga membuat alat terintegrasi Odoo untuk melaporkan tugas yang telah saya selesaikan, menulis unit test menggunakan JUnit dan Mockito, serta membantu menyelesaikan masalah produksi.',
    'View Full Resume': 'Lihat CV Lengkap',
    'What I Know': 'Keahlian Saya',
    'Skills & Technologies': 'Keahlian & Teknologi',
    'Backend Development': 'Pengembangan Backend',
    'Scheduler-triggered processes': 'Proses terjadwal',
    'Caching & Messaging': 'Caching & Pesan',
    'Producer & Consumer': 'Producer & Consumer',
    'Topic Configuration': 'Konfigurasi Topik',
    'Testing': 'Pengujian',
    'Unit Testing': 'Pengujian Unit',
    'Integration & Data Processing': 'Integrasi & Pemrosesan Data',
    'Excel Processing': 'Pemrosesan Excel',
    'PDF Processing': 'Pemrosesan PDF',
    'Tools': 'Peralatan',
    "Where I've Worked": 'Tempat Saya Bekerja',
    'Backend Developer': 'Backend Developer',
    'June 2022 – Present': 'Juni 2022 – Sekarang',
    'Designed, developed, and maintained Java and Spring Boot backend services supporting multiple warehouse operational systems': 'Merancang, mengembangkan, dan memelihara layanan backend Java dan Spring Boot untuk berbagai sistem operasional gudang',
    'Built RESTful APIs from scratch, implementing business logic, CRUD operations, and scheduler-triggered processes for warehouse workflows': 'Membangun RESTful API dari awal, menerapkan logika bisnis, operasi CRUD, dan proses terjadwal untuk alur kerja gudang',
    'Used Redis caching to reduce endpoint response time from 800 ms or more under high load to approximately 250 ms, applied Redis locks to reduce duplicate processing, and used Redis Queue for asynchronous API processing': 'Menggunakan cache Redis untuk mengurangi waktu respons endpoint dari 800 ms atau lebih menjadi sekitar 250 ms saat beban tinggi, menerapkan Redis lock untuk mengurangi pemrosesan duplikat, dan menggunakan Redis Queue untuk pemrosesan API asinkron',
    'Developed Apache Kafka producers, consumers, and topics to move synchronous processing into asynchronous workflows, allowing endpoints to respond sooner while backend work continues in the background': 'Mengembangkan producer, consumer, dan topik Apache Kafka untuk mengubah pemrosesan sinkron menjadi alur asinkron, sehingga endpoint dapat merespons lebih cepat sementara proses backend berjalan di latar belakang',
    'Created backend unit tests using JUnit and Mockito': 'Membuat unit test backend menggunakan JUnit dan Mockito',
    'Investigated and resolved production issues to help maintain application stability and continuity of warehouse operations': 'Menyelidiki dan menyelesaikan masalah produksi untuk menjaga stabilitas aplikasi dan kelangsungan operasional gudang',
    'Worked with QA, product, and cross-functional teams to deliver and maintain backend solutions': 'Bekerja sama dengan tim QA, produk, dan lintas fungsi untuk menghadirkan dan memelihara solusi backend',
    'Backend Case Studies': 'Studi Kasus Backend',
    'Selected work described without internal system details.': 'Pekerjaan terpilih dijelaskan tanpa rincian sistem internal.',
    'Faster responses with Redis': 'Respons lebih cepat dengan Redis',
    'Problem:': 'Masalah:',
    'An endpoint took 800 ms or more to respond under high load.': 'Sebuah endpoint membutuhkan 800 ms atau lebih untuk merespons saat beban tinggi.',
    'Solution:': 'Solusi:',
    'Used Redis caching to reduce repeated database access and Redis locks to reduce the risk of duplicate processing.': 'Menggunakan cache Redis untuk mengurangi akses database berulang dan Redis lock untuk mengurangi risiko pemrosesan duplikat.',
    'Result:': 'Hasil:',
    'Response time decreased to approximately 250 ms under high load.': 'Waktu respons turun menjadi sekitar 250 ms saat beban tinggi.',
    'Asynchronous processing with Kafka': 'Pemrosesan asinkron dengan Kafka',
    'Synchronous backend processing delayed responses to the frontend.': 'Pemrosesan backend sinkron memperlambat respons ke frontend.',
    'Developed Kafka producers and consumers to move processing into an asynchronous workflow.': 'Mengembangkan producer dan consumer Kafka untuk memindahkan pemrosesan ke alur kerja asinkron.',
    'Endpoints could respond sooner while backend processing continued in the background.': 'Endpoint dapat merespons lebih cepat sementara pemrosesan backend berlanjut di latar belakang.',
    'For the complete work history and details, please': 'Untuk riwayat kerja dan rincian lengkap, silakan',
    'view the full CV': 'lihat CV lengkap',
    "What I've Built": 'Proyek Saya',
    'Timesheet Automation Tool': 'Alat Otomatisasi Timesheet',
    'A tool I built to consolidate my completed tasks into timesheets for reporting to my company via Odoo ERP. It parses Excel and PDF files in predefined formats, submits processed data through the Odoo JSON-RPC API, and produces CSV and Excel output. No live demonstration is provided. It reduced Odoo timesheet input from approximately 5–10 minutes to 1–2 minutes or less.': 'Alat yang saya buat untuk merekap tugas yang telah saya selesaikan menjadi timesheet sebagai laporan ke perusahaan melalui Odoo ERP. Alat ini memproses file Excel dan PDF dengan format yang ditentukan, mengirimkan data melalui Odoo JSON-RPC API, dan menghasilkan keluaran CSV dan Excel. Tidak tersedia demonstrasi langsung. Waktu input timesheet Odoo berkurang dari sekitar 5–10 menit menjadi 1–2 menit atau kurang.',
    'Excel/PDF Processing': 'Pemrosesan Excel/PDF',
    'Excel and PDF timesheet data parsing': 'Pemrosesan data timesheet Excel dan PDF',
    'Odoo JSON-RPC timesheet submission': 'Pengiriman timesheet melalui Odoo JSON-RPC',
    'Approximately 5–10 minutes reduced to 1–2 minutes or less': 'Sekitar 5–10 menit berkurang menjadi 1–2 menit atau kurang',
    'CSV and Excel output': 'Keluaran CSV dan Excel',
    'Open Rack n Roll': 'Buka Rack n Roll',
    'A personal web application built for a billiards tournament organizer to set up tournaments, manage participant registrations and payment status, and view tournament brackets. The bracket interface uses React, with browser storage and Firebase-based bracket preview sharing. Organizer Instagram: @rnr.intan.': 'Aplikasi web pribadi untuk penyelenggara turnamen biliar guna mengatur turnamen, mengelola pendaftaran dan status pembayaran peserta, serta melihat bagan turnamen. Antarmuka bagan menggunakan React, dengan penyimpanan browser dan berbagi pratinjau bagan berbasis Firebase. Instagram penyelenggara: @rnr.intan.',
    'Excel/PDF Export': 'Ekspor Excel/PDF',
    'Tournament setup': 'Pengaturan turnamen',
    'Participant and payment tracking': 'Pelacakan peserta dan pembayaran',
    'Tournament brackets': 'Bagan turnamen',
    "You're looking at it!": 'Anda sedang melihatnya!',
    'Personal Portfolio Website': 'Situs Portofolio Pribadi',
    'This portfolio — a fully responsive, single-page application built entirely with semantic HTML5, modern CSS (custom properties, Grid, Flexbox), and vanilla JavaScript ES6+. Features dark/light mode with localStorage persistence, AOS scroll-reveal animations, categorized skill tags, a role text cycler, and 3D card tilt effects — all with zero build tools or frameworks required.': 'Portofolio ini adalah aplikasi satu halaman yang responsif, dibuat dengan HTML5 semantik, CSS modern (custom properties, Grid, Flexbox), dan vanilla JavaScript ES6+. Fiturnya mencakup mode gelap/terang yang tersimpan di localStorage, animasi gulir AOS, kategori keahlian, teks peran bergantian, dan efek kemiringan kartu 3D — tanpa alat build atau framework.',
    'Dark / Light mode with localStorage persistence': 'Mode gelap / terang tersimpan di localStorage',
    'Fully responsive — mobile, tablet & desktop': 'Responsif untuk ponsel, tablet & desktop',
    'No build step — opens directly in any browser': 'Tanpa proses build — dapat langsung dibuka di browser',
    'Categorized skill tags': 'Kategori keahlian',
    'Academic Background': 'Latar Belakang Akademik',
    'Education': 'Pendidikan',
    'Bachelor of Informatics Engineering (S.Kom)': 'Sarjana Teknik Informatika (S.Kom)',
    'Take a Break': 'Istirahat Sejenak',
    'Dino Game': 'Permainan Dino',
    'Space / ↑': 'Spasi / ↑',
    'The classic Chrome Dino game — dodge cacti, duck under pterodactyls, and survive as long as you can!': 'Permainan Dino Chrome klasik — hindari kaktus, merunduk di bawah pterodactyl, dan bertahan selama mungkin!',
    'Jump': 'Lompat',
    'Duck (dodge pterodactyl)': 'Merunduk (hindari pterodactyl)',
    'Play Dino Game': 'Mainkan Permainan Dino',
    'Click to play · Space to jump': 'Klik untuk bermain · Spasi untuk melompat',
    "Let's Connect": 'Mari Terhubung',
    "Whether you have a project idea, a job opportunity, or just want to say hello — I'd love to hear from you. Feel free to reach out through any of these channels.": 'Punya ide proyek, peluang kerja, atau ingin menyapa? Saya senang mendengar kabar dari Anda. Silakan hubungi saya melalui salah satu saluran berikut.',
    'Built with': 'Dibuat dengan',
    'by': 'oleh',
    '© 2026 Rabbani Ridho Ihsani. All rights reserved.': '© 2026 Rabbani Ridho Ihsani. Hak cipta dilindungi.',
    'Like this portfolio': 'Sukai portofolio ini',
    'Share this portfolio': 'Bagikan portofolio ini',
    'Share': 'Bagikan',
    'Shared!': 'Dibagikan!',
    'Copied!': 'Disalin!',
    'Check out this portfolio by Rabbani Ridho Ihsani, Backend Developer!': 'Lihat portofolio Rabbani Ridho Ihsani, Backend Developer!',
    'Back to top': 'Kembali ke atas',
    'Drag me!': 'Geser saya!',
    'Download PDF': 'Unduh PDF',
    'Languages': 'Bahasa',
    'Indonesian — Native': 'Bahasa Indonesia — Penutur asli',
    'English — Intermediate': 'Bahasa Inggris — Menengah',
    'Technical Skills': 'Keahlian Teknis',
    'Integration': 'Integrasi',
    'Excel/PDF data processing': 'Pemrosesan data Excel/PDF',
    'Professional Summary': 'Ringkasan Profesional',
    'Java Backend Engineer with 4+ years of experience at PT Tri Adi Bersama (Anteraja), building warehouse systems with Java, Spring Boot, RESTful APIs, Redis, and Apache Kafka. Experienced in production support, backend testing with JUnit and Mockito, and Odoo integration for timesheet reporting.': 'Java Backend Engineer dengan pengalaman lebih dari 4 tahun di PT Tri Adi Bersama (Anteraja), membangun sistem pergudangan dengan Java, Spring Boot, RESTful API, Redis, dan Apache Kafka. Berpengalaman dalam dukungan produksi, pengujian backend menggunakan JUnit dan Mockito, serta integrasi Odoo untuk pelaporan timesheet.',
    'Work Experience': 'Pengalaman Kerja',
    'Built and maintained Java and Spring Boot services, RESTful APIs, and scheduled processes for warehouse operations.': 'Membangun dan memelihara layanan Java dan Spring Boot, RESTful API, serta proses terjadwal untuk operasional gudang.',
    'Reduced endpoint response time under high load from 800 ms or more to approximately 250 ms using Redis caching. Applied Redis locks to reduce duplicate processing and Redis Queue for asynchronous APIs.': 'Mengurangi waktu respons endpoint saat beban tinggi dari 800 ms atau lebih menjadi sekitar 250 ms menggunakan cache Redis. Menerapkan Redis lock untuk mengurangi pemrosesan duplikat dan Redis Queue untuk API asinkron.',
    'Developed Kafka producers, consumers, and topics to move synchronous work into asynchronous workflows, allowing endpoints to respond sooner.': 'Mengembangkan producer, consumer, dan topik Kafka untuk mengubah proses sinkron menjadi alur kerja asinkron agar endpoint merespons lebih cepat.',
    'Created JUnit and Mockito tests, resolved production issues, and worked with QA and product teams.': 'Membuat pengujian JUnit dan Mockito, menyelesaikan masalah produksi, dan bekerja sama dengan tim QA dan produk.',
    'Personal & Professional Projects': 'Proyek Pribadi & Profesional',
    'Individual Tool · Work Reporting': 'Alat Individu · Pelaporan Kerja',
    'Built a tool to consolidate my completed tasks into timesheets for company reporting via Odoo JSON-RPC. Parses Excel/PDF files and exports CSV/Excel. Reduced Odoo timesheet input from approximately 5–10 minutes to 1–2 minutes or less.': 'Membuat alat untuk merekap tugas yang telah saya selesaikan menjadi timesheet sebagai laporan ke perusahaan melalui Odoo JSON-RPC. Memproses file Excel/PDF dan mengekspor CSV/Excel. Mengurangi waktu input timesheet Odoo dari sekitar 5–10 menit menjadi 1–2 menit atau kurang.',
    'Personal Project · Billiards Tournament Organizer': 'Proyek Pribadi · Penyelenggara Turnamen Biliar',
    'Built a personal web application for a billiards tournament organizer. Supports tournament setup, participant and payment tracking, and tournament brackets with scores and winner advancement. Uses JavaScript, React, Firebase, browser storage, and Excel/PDF export. Organizer Instagram: @rnr.intan.': 'Membangun aplikasi web pribadi untuk penyelenggara turnamen biliar. Mendukung pengaturan turnamen, pelacakan peserta dan pembayaran, serta bagan turnamen dengan skor dan kelanjutan pemenang. Menggunakan JavaScript, React, Firebase, penyimpanan browser, dan ekspor Excel/PDF. Instagram penyelenggara: @rnr.intan.'
  };

  function resolveLanguage(value) {
    return value === 'id' ? 'id' : 'en';
  }

  function translate(text, language) {
    const key = text.trim().replace(/\s+/g, ' ');
    return resolveLanguage(language) === 'id' && Object.prototype.hasOwnProperty.call(indonesian, key) ? indonesian[key] : key;
  }

  function pdfForLanguage(language) {
    return `cv-rabbani-ridho-ihsani${resolveLanguage(language) === 'id' ? '-id' : ''}.pdf`;
  }

  const api = { translate, resolveLanguage, pdfForLanguage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root || !root.document) return;
  root.PortfolioI18n = api;

  root.document.addEventListener('DOMContentLoaded', () => {
    const document = root.document;
    const textNodes = [];
    const attributes = [];
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement.closest('script, style, svg, option') || !node.nodeValue.trim()
          ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const original = node.nodeValue;
      if (Object.prototype.hasOwnProperty.call(indonesian, original.trim().replace(/\s+/g, ' '))) textNodes.push({ node, original });
    }
    document.querySelectorAll('[aria-label], [title]').forEach(element => {
      ['aria-label', 'title'].forEach(name => {
        const original = element.getAttribute(name);
        if (original && Object.prototype.hasOwnProperty.call(indonesian, original)) attributes.push({ element, name, original });
      });
    });
    const selector = document.getElementById('languageSelector');
    const languageLabel = document.getElementById('languageLabel');
    const download = document.querySelector('.download-button');

    function applyLanguage(language) {
      language = resolveLanguage(language);
      api.language = language;
      document.documentElement.lang = language;
      textNodes.forEach(({ node, original }) => {
        node.nodeValue = original.replace(/\S[\s\S]*\S|\S/, translate(original, language));
      });
      attributes.forEach(({ element, name, original }) => element.setAttribute(name, translate(original, language)));
      if (selector) selector.value = language;
      if (languageLabel) languageLabel.textContent = language === 'id' ? 'INA' : 'ENG';
      if (download) download.href = `${pdfForLanguage(language)}?v=2026112408`;
      root.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
    }

    const requested = new URLSearchParams(root.location.search).get('lang');
    applyLanguage(requested || root.localStorage.getItem('portfolio_language'));
    if (selector) selector.addEventListener('change', () => {
      root.localStorage.setItem('portfolio_language', selector.value);
      applyLanguage(selector.value);
    });
    root.addEventListener('storage', event => {
      if (event.key === 'portfolio_language') applyLanguage(event.newValue);
    });
  });
})(typeof window === 'undefined' ? null : window);
