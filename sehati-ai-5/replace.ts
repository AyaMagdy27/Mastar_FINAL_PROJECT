import * as fs from 'fs';
import * as path from 'path';

const files = [
  'src/pages/Landing.tsx', 
  'src/pages/Login.tsx', 
  'src/pages/LoginView.tsx', 
  'src/pages/Dashboard.tsx'
];

for (const file of files) {
  const p = path.resolve(process.cwd(), file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/Sehaty AI/g, 'Sehati AI');
    content = content.replace(/Sehaty/g, 'Sehati');
    content = content.replace(/SEHATY/g, 'SEHATI');
    content = content.replace(/sehatyai/g, 'sehatiai');
    content = content.replace(/MedCore/g, 'Sehati AI');
    fs.writeFileSync(p, content);
    console.log(`Updated ${file}`);
  }
}
