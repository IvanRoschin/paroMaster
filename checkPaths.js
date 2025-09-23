const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, 'app');
const PAGES_DIR = path.join(__dirname, 'pages');

// -------------------- Получение маршрутов --------------------
function getRoutes(dir, base = '') {
  let routes = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      routes = routes.concat(getRoutes(fullPath, path.join(base, file)));
    } else if (file.toLowerCase() === 'page.tsx') {
      routes.push('/' + base.replace(/\\/g, '/').toLowerCase());
    }
  });

  return routes;
}

const appRoutes = fs.existsSync(APP_DIR) ? getRoutes(APP_DIR) : [];
const pageRoutes = fs.existsSync(PAGES_DIR) ? getRoutes(PAGES_DIR) : [];
const allRoutes = [...appRoutes, ...pageRoutes];

console.log('Найденные маршруты:');
allRoutes.forEach(r => console.log(r));

// -------------------- Получение href из проекта --------------------
function findHrefFiles(dir) {
  const files = fs.readdirSync(dir);
  let hrefs = [];

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      hrefs = hrefs.concat(findHrefFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const matches = content.match(/href=["']([^"']+)["']/g);
      if (matches) {
        matches.forEach(m => {
          const link = m.match(/href=["']([^"']+)["']/)[1];
          hrefs.push({ link, file: fullPath });
        });
      }
    }
  });

  return hrefs;
}

const projectHrefLinks = findHrefFiles(path.join(__dirname, 'app'));
console.log('\nСсылки href в проекте:');
projectHrefLinks.forEach(h => console.log(`${h.link} (в ${h.file})`));

// -------------------- Сравнение и предложения исправлений --------------------
console.log('\nПроверка соответствия ссылок и маршрутов:');
projectHrefLinks.forEach(h => {
  const linkLower = h.link.toLowerCase();
  if (!allRoutes.includes(linkLower)) {
    console.warn(
      `⚠️  Ссылка "${h.link}" не соответствует существующему маршруту!`
    );

    // Попытка найти ближайший маршрут по регистру
    const match = allRoutes.find(r => r.toLowerCase() === linkLower);
    if (match) {
      console.log(`   ➡ Предлагается исправить href на: "${match}"`);
    } else {
      console.log('   ➡ Маршрут не найден, проверьте папку/файл физически.');
    }
  }
});

// -------------------- Автоматическая проверка папок --------------------
function checkFolderCase(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Проверяем имя папки на соответствие нижнему регистру
      if (file !== file.toLowerCase()) {
        console.warn(
          `⚠️  Папка "${fullPath}" имеет заглавные буквы. Рекомендуется переименовать в "${file.toLowerCase()}"`
        );
      }
      checkFolderCase(fullPath);
    }
  });
}

console.log('\nПроверка регистров папок в app/ и pages/:');
if (fs.existsSync(APP_DIR)) checkFolderCase(APP_DIR);
if (fs.existsSync(PAGES_DIR)) checkFolderCase(PAGES_DIR);

console.log('\n✅ Проверка завершена.');
