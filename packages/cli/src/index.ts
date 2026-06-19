#!/usr/bin/env node
import { Command } from 'commander';
import { blue, green, red } from 'kolorist';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const program = new Command();
program.name('vextra').description('CLI for adding Vextra UI components').version('0.1.0');

program
  .command('add')
  .description('Add a component to your project')
  .argument('[component]', 'The component to add')
  .action(async (component) => {
    if (!component) {
      console.log(blue('\nInteractive mode coming soon...'));
      return;
    }

    console.log(blue(`\nAdding component: ${component}...`));

    try {
      const registryPath = path.resolve(__dirname, '../../../registry/public', `${component}.json`);

      try {
        await fs.access(registryPath);
      } catch (error) {
        console.log(red(`\n✖ Component "${component}" not found in registry.`));
        process.exit(1);
      }

      const fileContent = await fs.readFile(registryPath, 'utf-8');
      const componentData = JSON.parse(fileContent);
      const targetDir = path.join(process.cwd(), 'components', 'ui');
      await fs.mkdir(targetDir, { recursive: true });

      for (const file of componentData.files) {
        const filePath = path.join(targetDir, file.name);
        await fs.writeFile(filePath, file.content, 'utf-8');
        console.log(green(`✓ Created ${file.name}`));
      }

      if (componentData.dependencies && componentData.dependencies.length > 0) {
        console.log(blue(`\nInstalling dependencies...`));

        await new Promise((resolve, reject) => {
          const child = spawn('pnpm', ['add', ...componentData.dependencies], {
            stdio: 'inherit',
            shell: true,
          });

          child.on('close', (code) => {
            if (code === 0) {
              resolve(null);
            } else {
              reject(new Error(`Installation failed with code ${code}`));
            }
          });
        });
      }

      console.log(green(`\n✓ Component ${component} successfully added!`));
    } catch (error) {
      console.log(red(`\n✖ An error occurred while adding the component.`));
      console.error(error);
    }
  });

program.parse();
