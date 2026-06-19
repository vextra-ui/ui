const fs = require('node:fs');
const path = require('node:path');

// Define paths relative to this script
const REGISTRY_DIR = path.join(__dirname, '../components');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Make sure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configuration of our components
// Later, this could be moved to a separate registry.json file,
// but for now, it's easier to keep the list right here.
const components = [
  {
    name: 'button',
    dependencies: ['@base-ui/react', '@vanilla-extract/recipes'],
    files: ['button.tsx', 'button.css.ts'],
  },
];

console.log('Building registry...');

components.forEach((component) => {
  const componentData = {
    name: component.name,
    dependencies: component.dependencies,
    files: [],
  };

  component.files.forEach((fileName) => {
    const filePath = path.join(REGISTRY_DIR, fileName);

    if (fs.existsSync(filePath)) {
      // Read the raw source code of the file
      const content = fs.readFileSync(filePath, 'utf-8');

      componentData.files.push({
        name: fileName,
        content: content,
      });
    } else {
      console.warn(
        `Warning: File ${fileName} not found for component ${component.name}. Skipping...`,
      );
    }
  });

  // Write the final JSON file to the public directory
  const outputPath = path.join(OUTPUT_DIR, `${component.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(componentData, null, 2));

  console.log(`✅ Created ${component.name}.json`);
});

console.log('Registry build complete!');
