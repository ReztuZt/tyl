const { Bot, webhookCallback } = require("grammy");
const express = require("express");
const path = require("path");

require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

// Array pesan cinta untuk jadwal otomatis (30 pesan untuk 30 hari)
const scheduleMessages = [
  // Bahasa Inggris
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

  // Bahasa Indonesia
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
  "Kamu adalah hal terbaik yang pernah terjadi dalam hidupku. ",
  "I will make it,mark my word. ",
  "See you in the aisle",
  "Semoga kamu selalu bahagia dan sehat, 😘",
  "Life is when you busy make other plan",
  ""
  // Tambahkan hingga 10 pesan cinta
];

let isAuthenticated = false; // Status otentikasi pengguna

// Password untuk akses bot
const PASSWORD = "tiut";

// Contoh URL GIF
const gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDZxdjNsYmkzcjcyOW9nMXo0NmU0bnNhM2tvMDY0d2x2NGY0ajUwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pHla2xRtSiqBCv5IJu/giphy.gif';

// Command /start dengan autentikasi
bot.command("start", (ctx) => {
  ctx.replyWithAnimation(gifUrl); // Mengirim GIF
  ctx.reply("✨ Selamat datang Tiaaaaa ✨\n\nMasukkan password untuk memastikan bahwa ini kamu:", {
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
        `🎉 Selamat datang, Tia Ayu Lestari! 🎉\n\nSemoga hari ini penuh kebahagiaan dan Rezeki.Have a better day always❤️\n\n` +
        `Berikut ini beberapa hal yang bisa kamu lakukan dengan bot ini:\n\n` +
        `/Pesan - Dapatkan pesan acak 💌\n` +
        `/schedule - Pesan cinta otomatis setiap hari! ⏰\n` +
        `/instagram - Lihat akun Instagram kita! 📷\n\n` +
        `Silakan pilih salah satu perintah di atas!`
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
      ctx.reply("Pesan  otomatis sedang berjalan setiap hari! 1x24 jam");
    } else if (ctx.message.text === "/instagram") {
      ctx.reply("Kamu bisa mengikuti kami di Instagram: [yea_844](https://www.instagram.com/yea_844) 📸");
    } else {
      // Jika pengguna mengetik diluar perintah
      ctx.reply("Maaf ya, sepertinya aku belum mengerti apa yang kamu maksud. Mungkin kamu bisa tanya ke orang yang membuatku untuk bantuan lebih lanjut.");
      setTimeout(() => {
        ctx.reply("Apakah Anda ingin menghubunginya? 🧐", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Ya", callback_data: "contact_yes" }, { text: "Tidak", callback_data: "contact_no" }],
            ],
          },
        });
      }, 2000); // Delay 2 detik
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

// Menangani respon dari pilihan untuk menghubungi pembuat
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === "contact_yes") {
    ctx.reply("1");
    await delay(3000);
    ctx.reply("2");
    await delay(3000);
    ctx.reply("3");
    await delay(3000);
    ctx.reply("Pembuatku adalah 11! 🎉");
  } else if (data === "contact_no") {
    ctx.reply("Baiklah 😊");
  }
});

// Fungsi delay untuk menunggu sejenak
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start();
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
