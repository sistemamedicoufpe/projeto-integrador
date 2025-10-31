const fs = require('fs');
const path = require('path');

function addJsExtension(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addJsExtension(filePath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Add .js to relative imports (both ./ and ../)
      content = content.replace(
        /from ['"](\.\S+?)['"]/g,
        (match, p1) => {
          if (!p1.endsWith('.js') && !p1.includes('?') && !p1.includes('#')) {
            return `from '${p1}.js'`;
          }
          return match;
        }
      );

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  });
}

const distDir = path.join(__dirname, 'dist');
addJsExtension(distDir);
console.log('Import paths fixed!');
