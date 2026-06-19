#!/usr/bin/env node
import { Command } from 'commander';
import { blue, green, red, yellow } from 'kolorist';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import prompts from 'prompts';

const program = new Command();
program.name('vextra').description('CLI for adding Vextra UI components').version('0.1.0');

program
  .command('init')
  .description('Initialize project and configure component paths')
  .action(async () => {
    console.log(blue('\nInitializing Vextra UI...'));

    const response = await prompts([
      {
        type: 'text',
        name: 'componentsPath',
        message: 'Where would you like to store your components?',
        initial: 'components/ui',
      },
      {
        type: 'text',
        name: 'themePath',
        message: 'Where would you like to store the theme file (vars.css.ts)?',
        initial: 'styles/vars.css.ts',
      },
    ]);

    if (!response.componentsPath || !response.themePath) {
      console.log(red('\n✖ Initialization cancelled.'));
      process.exit(0);
    }

    const config = {
      components: response.componentsPath,
      theme: response.themePath,
    };

    const configPath = path.join(process.cwd(), 'vextra.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');

    console.log(green(`\n✓ Configuration saved to vextra.json`));
    console.log(blue(`You can now run "vextra add" to install components.`));
  });

async function addComponent(component: string) {
  console.log(blue(`\nAdding component: ${component}...`));

  try {
    const configPath = path.join(process.cwd(), 'vextra.json');
    let config;

    try {
      const configFile = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configFile);
    } catch (error) {
      console.log(red('\n✖ vextra.json not found.'));
      console.log(yellow('Please run "vextra init" first to configure your paths.'));
      return;
    }

    const registryPath = path.resolve(__dirname, '../../../registry/public', `${component}.json`);

    try {
      await fs.access(registryPath);
    } catch (error) {
      console.log(red(`\n✖ Component "${component}" not found in registry.`));
      return;
    }

    const fileContent = await fs.readFile(registryPath, 'utf-8');
    const componentData = JSON.parse(fileContent);
    const targetDir = path.join(process.cwd(), config.components);
    await fs.mkdir(targetDir, { recursive: true });

    for (const file of componentData.files) {
      const filePath = path.join(targetDir, file.name);
      await fs.writeFile(filePath, file.content, 'utf-8');
      console.log(green(`✓ Created ${file.name} in ${config.components}`));
    }

    if (componentData.dependencies && componentData.dependencies.length > 0) {
      console.log(blue(`Installing dependencies for ${component}...`));

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
}

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'The components to add')
  .action(async (components: string[]) => {
    let componentsToAdd = components;

    if (componentsToAdd.length === 0) {
      const response = await prompts({
        type: 'multiselect',
        name: 'selected',
        message: 'Which components would you like to add?',
        choices: [{ title: 'button', value: 'button' }],
        instructions: false,
      });

      if (!response.selected || response.selected.length === 0) {
        console.log(red('\n✖ No components selected. Exiting.'));
        process.exit(0);
      }

      componentsToAdd = response.selected;
    }

    for (const component of componentsToAdd) {
      await addComponent(component);
    }
  });

program.parse();
