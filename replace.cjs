const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /bg-\[#0B0C0D\]/g, replace: 'bg-slate-50 dark:bg-[#0B0C0D]' },
  { search: /bg-\[#0F1113\]/g, replace: 'bg-white dark:bg-[#0F1113]' },
  { search: /bg-\[#151719\]/g, replace: 'bg-white dark:bg-[#151719]' },
  { search: /(?<!hover:)bg-\[#1A1D1F\]/g, replace: 'bg-slate-100 dark:bg-[#1A1D1F]' },
  { search: /hover:bg-\[#1A1D1F\]/g, replace: 'hover:bg-slate-100 dark:hover:bg-[#1A1D1F]' },
  { search: /hover:bg-\[#24272A\]/g, replace: 'hover:bg-slate-200 dark:hover:bg-[#24272A]' },
  { search: /(?<!hover:)border-\[#24272A\]/g, replace: 'border-slate-200 dark:border-[#24272A]' },
  { search: /(?<!hover:)border-\[#33383E\]/g, replace: 'border-slate-300 dark:border-[#33383E]' },
  { search: /(?<!hover:)border-\[#4B5259\]/g, replace: 'border-slate-300 dark:border-[#4B5259]' },
  { search: /hover:border-\[#24272A\]/g, replace: 'hover:border-slate-200 dark:hover:border-[#24272A]' },
  { search: /hover:border-\[#33383E\]/g, replace: 'hover:border-slate-300 dark:hover:border-[#33383E]' },
  { search: /hover:border-\[#4B5259\]/g, replace: 'hover:border-slate-300 dark:hover:border-[#4B5259]' },
  { search: /(?<!hover:)text-\[#E1E4E6\]/g, replace: 'text-slate-900 dark:text-[#E1E4E6]' },
  { search: /hover:text-\[#E1E4E6\]/g, replace: 'hover:text-slate-900 dark:hover:text-[#E1E4E6]' },
  { search: /(?<!hover:)text-\[#8A929B\]/g, replace: 'text-slate-500 dark:text-[#8A929B]' },
  { search: /hover:text-\[#8A929B\]/g, replace: 'hover:text-slate-500 dark:hover:text-[#8A929B]' },
  { search: /(?<!hover:)text-\[#4B5259\]/g, replace: 'text-slate-400 dark:text-[#4B5259]' },
  { search: /hover:text-\[#4B5259\]/g, replace: 'hover:text-slate-400 dark:hover:text-[#4B5259]' },
  { search: /placeholder-\[#4B5259\]/g, replace: 'placeholder-slate-400 dark:placeholder-[#4B5259]' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  replacements.forEach(({ search, replace }) => {
    if (search.test(content)) {
      content = content.replace(search, replace);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
