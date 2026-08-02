import os
import re
import glob

# Components that we expect to be exported as default
UI_COMPONENTS = [
    'Button', 'Card', 'Input', 'Badge', 'Modal', 'Avatar', 
    'Skeleton', 'Select', 'Textarea', 'ProgressBar', 'StatCard', 
    'EmptyState', 'SearchBar', 'Dropdown', 'Tooltip', 'SpiderWebBackground', 
    'ParticleField', 'GlowOrb', 'NetworkLines', 'GradientMesh'
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Replace `import { Button } from '@/components/ui/Button'` with `import Button from '@/components/ui/Button'`
    # We will do this carefully for each component.
    for comp in UI_COMPONENTS:
        # Match `import { Comp } from '@/components/ui/Comp'` or `import { Comp, Other } from ...`
        # We need to handle this properly, but most likely it's just `import { Comp } from '@/components/ui/Comp'`
        # Let's use a regex that matches `import { ... Comp ... } from '@/components/ui/Comp'`
        # and replaces it with `import Comp from '@/components/ui/Comp'`
        # Note: If there are other things imported, this might drop them, but typically UI components are one per file
        
        # Simple case: import { Button } from ...
        pattern1 = r'import\s*\{\s*' + comp + r'\s*\}\s*from\s*[\'"]@/components/(ui|effects)/' + comp + r'\.?j?s?x?[\'"];?'
        replacement1 = f"import {comp} from '@/components/\\1/{comp}';"
        content = re.sub(pattern1, replacement1, content)

    # Some imports might be grouped: `import { Button, Card } from '@/components/ui'` 
    # Hopefully not, since aliases were used per file.
    
    # Let's also fix `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'`
    # if `Tabs` is default exported, but others are named.
    # Actually, we don't know how Tabs is exported. Let's run build again and see what breaks, 
    # but first fix the obvious ones.
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk('e:\\web site\\src'):
    for file in files:
        if file.endswith('.jsx'):
            fix_file(os.path.join(root, file))
