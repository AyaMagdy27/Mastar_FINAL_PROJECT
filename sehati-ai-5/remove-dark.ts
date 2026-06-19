import * as fs from 'fs';
import * as path from 'path';

function removeDark(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeDark(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove any string like "dark:something"
      // Note: [\w\[\]\-\/]+ matches tailwind names including arbitrary values like dark:bg-[#000]
      content = content.replace(/dark:[\w\[\]\-\/\#\.]+/g, '');
      
      // Remove double spaces
      content = content.replace(/ {2,}/g, ' ');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

removeDark('./components/ui');
