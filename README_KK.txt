BILIQ диагностикасы — Cloudflare Pages нұсқасы

ФАЙЛДАР:
- index.html — сайт интерфейсі, тест, автоматты тексеру, нәтиже және QR
- functions/api/submit.js — Cloudflare Pages Function: Telegram + Google Sheets
- google-apps-script.gs — Google Sheets-ке жазатын Apps Script
- Бұл нұсқада сайт нәтижені /api/submit адресіне жібереді.

1. GOOGLE SHEETS
1) Google Sheets-та жаңа кесте аш.
2) Extensions → Apps Script таңда.
3) google-apps-script.gs кодын қойып, сақта.
4) Deploy → New deployment → Web app.
5) Execute as: Me; Who has access: Anyone.
6) Deploy жасап, рұқсат беріп, Web app URL-ын көшір.

2. TELEGRAM
1) Telegram-да @BotFather арқылы бот жаса және bot token ал.
2) Өзіңнің Telegram аккаунтыңнан ботқа /start жібер.
3) Браузерде https://api.telegram.org/bot<ТОКЕН>/getUpdates аш.
4) JSON ішіндегі message.chat.id мәнін көшір.
5) Bot token-ді ешқашан index.html ішіне жазба.

3. CLOUDFLARE PAGES-ТЕ ЖАРИЯЛАУ
Cloudflare Pages Functions үшін файл құрылымы маңызды. Ең оңай жолы — Git арқылы:
1) ZIP-ті аш.
2) Файлдарды өзіңнің жеке GitHub репозиторийіңе жүкте.
3) Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
4) Репозиторийді таңда. Framework preset: None; Build command бос; Build output directory: / (репозиторий түбірі).
   Егер dashboard / мәнін қабылдамаса, output directory ретінде . қолданып көр.
5) Deploy жаса. Домен әдетте <жоба-аты>.pages.dev болып беріледі.

4. ENVIRONMENT VARIABLES / SECRETS
Cloudflare Pages жобасында Settings → Variables and Secrets бөлімінен мыналарды қос:
- TELEGRAM_BOT_TOKEN — BotFather токені (secret ретінде)
- TELEGRAM_CHAT_ID — жеке chat ID немесе топ ID
- GOOGLE_APPS_SCRIPT_URL — Apps Script Web app URL
Сақтаған соң қайта deploy жаса.

5. ӨЗ ДОМЕНІҢДІ ҚОСУ
- Егер biliq.kz домені сенің иелігіңде болса: Cloudflare Pages → Custom domains → Set up a custom domain → biliq.kz.
- test.biliq.kz үшін сол бөлімде test.biliq.kz енгіз.
- Негізгі доменді қосқанда Cloudflare DNS-ке қажетті жазбаларды өзі ұсынады; нұсқауларды орында.
- Егер домен басқа тіркеушіде болса, DNS-ті Cloudflare талаптарына сай өзгерту қажет болуы мүмкін. Доменді сатып алу немесе аккаунтқа кіру бұл жинаққа кірмейді.

6. QR-КОД
Жарияланған сайтты өз доменіңмен ашып, беттің төменіндегі QR бөлімінен QR-ды жүкте. QR сайттың нақты адресін кодтайды. Доменді кейін өзгертсең, QR-ды қайта жаса.

ТЕКСЕРУ
- Бетті ашып, тестті толық аяқта.
- Google Sheets-та жаңа жол пайда болғанын тексер.
- Telegram-ға хабарлама келгенін тексер.
- Біреудің шынайы дерегін пайдаланбай, алдымен өзіңнің тест деректеріңмен тексер.

ҚҰПИЯЛЫҚ
Оқушының аты-жөні мен телефон нөмірі жеке деректер. Құпиялық мәтінін, сақтау мерзімін және байланыс мақсатын жарияламас бұрын нақтыла. Бот токенін немесе құпия кілттерді клиенттік HTML-ға қоспа.
