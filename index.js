const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.BOT_TOKEN; // Replace with your bot token
const channelId = '@zakazchatbot416'; // Replace with your channel username

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
	{
		command: '/start',
		description: 'botni ishga tushirish',
	},
	{
		command: '/about',
		description: 'bu bot haqida malumot',
	},
]);
// Step tracking for each user
const userSteps = {};

// Questions for seller and buyer
const sellerQuestions = [
	{ text: '🔒 Botni Username:', key: 'user' },
	{ text: "👥 A'zolar soni:", key: 'members' },
	{ text: '🔥 Aktiv:', key: 'active' },
	{ text: '💰 Narxi:', key: 'price' },
	{ text: "💳 To'lov turi:", key: 'payment' },
	{ text: '♻️ Obmen:', key: 'exchange' },
	{ text: '🧑‍💻 Sotuvchi:', key: 'seller' },
	{ text: '✅ Egalik:', key: 'ownership' },
	{ text: '☎️ Nomer:', key: 'phone' },

	{ text: "🤖 Qo'shimcha ma'lumot:", key: 'info' },
];

const buyerQuestions = [
	{ text: '🔒 User:', key: 'user' },
	{ text: '☎️ Nomer:', key: 'phone' },
	{ text: '💬 Izoh:', key: 'comment' },
];

// Function to ask the next question
function askNextQuestion(chatId) {
	const step = userSteps[chatId].step;
	const questions = userSteps[chatId].isSeller
		? sellerQuestions
		: buyerQuestions;

	if (step < questions.length) {
		const question = questions[step];
		const options = {
			reply_markup: {
				force_reply: true,
			},
		};
		bot.sendMessage(chatId, question.text, options);
		userSteps[chatId].step++;
	} else {
		finalizeData(chatId);
	}
}

// Function to finalize and send the data
function finalizeData(chatId) {
	const postData = userSteps[chatId].data;
	let postMessage = '';

	if (userSteps[chatId].isSeller) {
		postMessage = `
🤖 Bot sotiladi.

🔒 Botni username: ${postData.user}
👥 Azolar soni: ${postData.members}
🔥 Aktiv: ${postData.active}
💰 Narxi: ${postData.price}
💳 To'lov turi: ${postData.payment}
♻️ Obmen: ${postData.exchange}
🧑‍💻 Sotuvchi: ${postData.seller}
✅ Egalik: ${postData.ownership}
☎️ Nomer: ${postData.phone}

  ❗Qo'shimcha ma'lumot❗
${postData.info}

E'lon berish uchun: @botlar_savdosibot

Kanal: @zakazchatbot416
    `;
	} else {
		postMessage = `
📌 Bot sotib olish.
🔒 Telegram UserName: ${postData.user}
☎️ Nomer: ${postData.phone}

💬 Izoh: ${postData.comment}

Elon berish uchun: @botlar_savdosibot

Kanal: @zakazchatbot416
    `;
	}

	// Options for the buttons

	// Inform the user that their message will be sent after 1 minute
	bot.sendMessage(
		chatId,
		"Ma'lumot 1 daqiqada @zakazchatbot416 kanaliga yetkaziladi⌛"
	);

	// Delay the sending of the message to the channel by 1 minute
	setTimeout(() => {
		bot
			.sendMessage(channelId, postMessage)
			.then(() => {
				// Inform the user that the message has been forwarded
				bot.sendMessage(chatId, 'Sizning xabaringiz kanalga yuborildi ✅');
				delete userSteps[chatId]; // Reset user's steps
			})
			.catch(error => {
				console.error(error);
				bot.sendMessage(
					chatId,
					'Xabaringizni kanalga yuborishda xatolik yuz berdi. 😩'
				);
			});
	}, 60000); // 1 minute delay (60000 ms)
}

// Start interaction with buttons for seller and buyer
bot.onText(/\/start/, msg => {
	const chatId = msg.chat.id;
	const options = {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Botni Sotuvchi', callback_data: 'seller' }],
				[{ text: 'Botni Sotib oluvchi', callback_data: 'buyer' }],
			],
		},
	};
	bot.sendMessage(
		chatId,
		`Assalomu alaykum hurmatli! ${msg.from.first_name} siz botimizga hush kelibsiz. Siz botingizni sotmoqchimisiz yoki Bot sotib olmoqchimisz?`,
		options
	);
});
bot.onText(/\/about/, msg => {
	const chatId = msg.chat.id;
	const text = `Assalomu alaykum! hurmatli ${msg.from.first_name}, siz bu bot bilan o'zingizni botingizni kanalga yuborib uni reklama qilishingiz va o'z botingizni sotishingiz mumkin va bu bot hech qanday konstruktor va botlarsiz JavaScript dasturlash tilida qilingan, va bu botni kerakli joylarini to'ldirib bo'lganingizdan so'ng sizning botingiz https://t.me/zakazchatbot416 manashu kanalga chiqadi, va sizga eslatib o'tishimiz kerakki bot sizdan quyidagi savollarni so'raganida siz buni to'ldirishngiz shart bo'ladi: 📌 Bot sotiladi.
  🔒 Botni username: @
  👥 Azolar soni: 
  🔥 Aktiv: 
  💰 Narxi: 
  💳 To'lov turi: 
  ♻️ Obmen: 
  🧑‍💻 Sotuvchi: @
  ✅ Egalik: 
  ☎️ Nomer: +998 
  
 va botga /start bosganingizdan keyin Bot sizdan manashunaqa ma'lumot so'raganida hamma ma'lumotlarni to'g'ri bering yoki hamma ma'lumotlarni kiritishingiz shart aks holda sizni e'loningiz kanalga chiqmasligi mumkin! 🔒 Botni username: @ degan joyiga siz botingizni usernamini kiritasiz va yana takidlash kerakki 🧑‍💻 Sotuvchi: @ shu joyiga telegram usernamingizni qoldiring ismingizni emas bu shart agar ba'zi ma'lumotlarni kiritmasangiz sizning e'loningiz o'chiriladi yoki kanalga chiqarilmay qolishi mumkin va telefon raqamingizni ham to'g'ri kiriting bu narsalar sizning mijozingiz siz bilan bog'lanishi uchun kerak va sizni e'loningiz 1-daqiqa ichida kanalga yetkaziladi va agar siz /start bosganingizdan so'ng bot sizdan botni olmoqchimisiz yoki sotmoqchimisiz deb so'raydi agar siz Botni sotuvchi tugmasini bossangiz siz botingizni e'lonini berasiz agarda siz botni sotib olishni tanlasangiz botni sotib olmoqchi bo'lasiz va botga Telegram UserNameingizni kiriting deb so'raydi bunda siz telegram usernamingizni kiritishingiz kerak bo'ladi va telefon raqamingizni ham kiritasiz va izoh degan joyiga siz qanaqa bot sotib olmoqchilgingizni yozib qoldirasiz`;
	bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
});
// Handle button clicks
bot.on('callback_query', callbackQuery => {
	const chatId = callbackQuery.message.chat.id;
	const action = callbackQuery.data;

	if (action === 'seller') {
		userSteps[chatId] = { step: 0, data: {}, isSeller: true };
	} else if (action === 'buyer') {
		userSteps[chatId] = { step: 0, data: {}, isSeller: false };
	}
	askNextQuestion(chatId);
});

// Handle all incoming messages
bot.on('message', msg => {
	const chatId = msg.chat.id;

	if (!userSteps[chatId] || msg.text === '/start') return;

	const step = userSteps[chatId].step - 1;
	const questions = userSteps[chatId].isSeller
		? sellerQuestions
		: buyerQuestions;
	if (step >= 0 && step < questions.length) {
		const key = questions[step].key;
		userSteps[chatId].data[key] = msg.text;

		// Check if the user has provided all necessary information
		if (!msg.text || msg.text.trim() === '') {
			bot.sendMessage(chatId, "Iltimos, barcha ma'lumotlarni to'ldiring❗");
			userSteps[chatId].step--; // Decrement the step to ask the question again
		} else {
			askNextQuestion(chatId);
		}
	}
});

// Handle any unexpected input
bot.on('polling_error', error => {
	console.log(error.code); // => 'EFATAL'
});
