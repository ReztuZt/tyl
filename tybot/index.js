const { Bot, webhookCallback } = require("grammy");
const express = require("express");
require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

// Array pesan cinta untuk jadwal otomatis (30 pesan untuk 30 hari)
const scheduleMessages = [
  "Good morning, hope today brings you joy. ☀️",
  "Your presence makes everything feel right. 😊",
  "Today is another chance to enjoy life. 🌼",
  "I hope you find beauty in the little things today. 🌟",
  "Thinking of you brightens my day. 💖",
  "Every moment with you is a memory worth keeping. 🎁",
  "Your ideas always inspire me. 🌈",
  "With you, even the ordinary becomes special. 🌍",
  "Just a reminder: you make a difference. ✨",
  "Your smile can light up the darkest days. 🎶",
  "Time spent with you is never wasted. 🥰",
  "You have a way of making life feel easier. 🌅",
  "I appreciate everything you do. ⏳",
  "Your perspective brings clarity. 💪",
  "You are a part of my favorite moments. 💭",
  "Selamat pagi, semoga harimu menyenangkan. ☀️",
  "Kehadiranmu membawa suasana yang berbeda. 😊",
  "Hari ini adalah kesempatan untuk menikmati hidup. 🌼",
  "Semoga kamu menemukan keindahan dalam hal-hal kecil. 🌟",
  "Pikiranku selalu terarah padamu di saat-saat tertentu. 💖",
  "Setiap momen bersamamu terasa berharga. 🎁",
  "Ide-idemu selalu memberikan inspirasi. 🌈",
  "Bersamamu, hal-hal biasa jadi lebih berarti. 🌍",
  "Hanya ingin mengingatkan: kamu membuat perbedaan. ✨",
  "Senyummu bisa mengubah suasana hati. 🎶",
  "Waktu bersamamu tak pernah terbuang sia-sia. 🥰",
  "Kamu memiliki cara untuk membuat segalanya terasa lebih mudah. 🌅",
  "Aku menghargai semua yang kamu lakukan. ⏳",
  "Pandanganmu memberikan kejelasan. 💪",
  "Kamu selalu ada dalam kenangan indahku. 💭",
];

const loveMessages = [
  "Kamu adalah hal terbaik yang pernah terjadi dalam hidupku.",
  "I will make it, mark my word.",
  "See you in the aisle.",
  "Semoga kamu selalu bahagia dan sehat, 😘",
  "Life is when you busy making other plans.",
  // Tambahkan hingga 10 pesan cinta lainnya
];

let isAuthenticated = false; // Status otentikasi pengguna
const PASSWORD = "tiut"; // Password untuk akses bot

// Command /start dengan autentikasi
bot.command("start", (ctx) => {
  ctx.reply("✨ Selamat datang! Masukkan password untuk memastikan bahwa ini kamu:", {
    reply_markup: {
      force_reply: true, // Memaksa pengguna untuk membalas
    },
  });
});

// Menangani input password dan perintah
bot.on("message:text", (ctx) => {
  if (!isAuthenticated) {
    if (ctx.message.text === PASSWORD) {
      isAuthenticated = true; // Set status otentikasi ke true
      ctx.reply(
        `🎉 Selamat datang! 🎉\n\nSilakan pilih perintah yang bisa kamu lakukan:\n\n` +
        `/Pesan - Dapatkan pesan acak 💌\n` +
        `/schedule - Pesan otomatis setiap hari! ⏰\n` +
        `/Instagram - Lihat akun Instagram kita! 📷`
      );
      startDailyMessages(ctx);  // Memulai pesan terjadwal harian setelah otentikasi
    } else {
      ctx.reply("❌ Password salah. Coba lagi!");
    }
  } else {
    // Jika sudah terautentikasi, tangani perintah lainnya
    if (ctx.message.text === "/Pesan") {
      const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      ctx.reply(randomMessage);
    } else if (ctx.message.text === "/schedule") {
      ctx.reply("Pesan otomatis sedang berjalan setiap hari! 1x24 jam.");
    } else if (ctx.message.text === "/Instagram") {
      ctx.reply("Kamu bisa mengikuti kami di Instagram: [yea_844](https://www.instagram.com/yea_844) 📸");
    } else {
      ctx.reply("Maaf, sepertinya aku belum mengerti. Mungkin kamu bisa tanya ke orang yang membuatku untuk bantuan lebih lanjut.");
    }
  }
});

// Fungsi untuk mengirim pesan setiap hari secara otomatis
function startDailyMessages(ctx) {
  let index = 0; // Indeks untuk pesan terjadwal
  setInterval(() => {
    if (index < scheduleMessages.length) {
      ctx.reply(scheduleMessages[index]);
      index++;
    } else {
      index = 0; // Reset setelah semua pesan terkirim
    }
  }, 24 * 60 * 60 * 1000); // Setiap 24 jam (1 hari)
}

// Pengaturan webhook dan mendengarkan server
if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express")); // Mengatur webhook

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start(); // Menjalankan bot secara lokal
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
