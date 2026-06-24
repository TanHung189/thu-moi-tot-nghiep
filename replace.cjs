const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-white\/10/g, 'text-slate-200');
  content = content.replace(/text-white\/20/g, 'text-slate-300');
  content = content.replace(/text-white\/30/g, 'text-slate-400');
  content = content.replace(/text-white\/40/g, 'text-slate-400');
  content = content.replace(/text-white\/50/g, 'text-slate-500');
  content = content.replace(/text-white\/60/g, 'text-slate-500');
  content = content.replace(/text-white\/70/g, 'text-slate-600');
  content = content.replace(/text-white\/80/g, 'text-slate-700');
  content = content.replace(/text-white/g, 'text-slate-800');

  content = content.replace(/bg-navy-950/g, 'bg-white');
  content = content.replace(/bg-navy-900/g, 'bg-slate-50');
  
  content = content.replace(/bg-white\/5/g, 'bg-slate-100');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  content = content.replace(/bg-white\/20/g, 'bg-slate-200');
  
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/20/g, 'border-slate-300');
  content = content.replace(/border-white\/30/g, 'border-slate-300');

  // Specific App.tsx styles
  content = content.replace(/rgba\(7, 19, 39, 0\.85\)/g, 'rgba(255, 255, 255, 0.85)');
  content = content.replace(/1px solid rgba\(212, 160, 23, 0\.2\)/g, '1px solid rgba(0, 0, 0, 0.05)');
  content = content.replace(/boxShadow: '0 4px 30px rgba\(0,0,0,0\.4\)'/g, "boxShadow: '0 4px 30px rgba(0,0,0,0.05)'");

  fs.writeFileSync(file, content);
});
console.log('Done replacement in tsx files');
