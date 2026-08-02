const fs = require('fs');
const path = require('path');

const replacements = [
    {
        file: 'src/layouts/DashboardLayout.jsx',
        from: 'bg-gradient-mesh',
        to: 'gradient-mesh'
    },
    {
        file: 'src/layouts/PublicLayout.jsx',
        from: 'bg-gradient-mesh',
        to: 'gradient-mesh'
    },
    {
        file: 'src/layouts/AuthLayout.jsx',
        from: 'bg-gradient-mesh',
        to: 'gradient-mesh'
    },
    {
        file: 'src/pages/NotFound.jsx',
        from: 'bg-gradient-mesh',
        to: 'gradient-mesh'
    },
    {
        file: 'src/components/landing/CTASection.jsx',
        from: 'bg-gradient-mesh',
        to: 'gradient-mesh'
    },
    {
        file: 'src/components/layout/TopBar.jsx',
        from: 'bg-gradient-primary',
        to: 'gradient-primary'
    },
    {
        file: 'src/components/landing/StatsSection.jsx',
        from: 'bg-gradient-primary',
        to: 'gradient-primary'
    },
    {
        file: 'src/components/landing/AIShowcase.jsx',
        from: 'bg-gradient-primary',
        to: 'gradient-primary'
    },
    {
        file: 'src/pages/CompanyPage.jsx',
        from: 'bg-gradient-primary',
        to: 'gradient-primary'
    },
    {
        file: 'src/components/landing/FeaturesSection.jsx',
        from: 'bg-gradient-accent',
        to: 'gradient-accent'
    }
];

const root = 'e:\\web site';

for (const r of replacements) {
    const fullPath = path.join(root, r.file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const regex = new RegExp(r.from, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, r.to);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated ${r.file}`);
        } else {
            console.log(`Pattern ${r.from} not found in ${r.file}`);
        }
    } else {
        console.log(`File not found: ${r.file}`);
    }
}
