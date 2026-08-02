const fs = require('fs');
const path = require('path');

const UI_COMPONENTS = [
    'Button', 'Card', 'Input', 'Badge', 'Modal', 'Avatar', 
    'Skeleton', 'Select', 'Textarea', 'ProgressBar', 'StatCard', 
    'EmptyState', 'SearchBar', 'Dropdown', 'Tooltip', 'SpiderWebBackground', 
    'ParticleField', 'GlowOrb', 'NetworkLines', 'GradientMesh'
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('e:\\web site\\src', function(filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        for (const comp of UI_COMPONENTS) {
            const regex = new RegExp(`import\\s*\\{\\s*${comp}\\s*\\}\\s*from\\s*['"]@/components/(ui|effects)/${comp}\\.?j?s?x?['"];?`, 'g');
            content = content.replace(regex, `import ${comp} from '@/components/$1/${comp}';`);
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed', filePath);
        }
    }
});
