#!/usr/bin/env node
import { Command } from 'commander';
import { blue, green, red, yellow } from 'kolorist';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import prompts from 'prompts';

const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/vextra-ui/ui/main/registry/public';
const program = new Command();
program.name('vextra').description('CLI for adding Vextra UI components').version('0.1.0');
const themeTemplate = `import { globalStyle } from '@vanilla-extract/css';

globalStyle(':root', {
  vars: {
    '--background': '0 0% 100%',
    '--foreground': '240 10% 3.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '240 10% 3.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '240 10% 3.9%',
    '--primary': '240 5.9% 10%',
    '--primary-foreground': '0 0% 98%',
    '--secondary': '240 4.8% 95.9%',
    '--secondary-foreground': '240 5.9% 10%',
    '--muted': '240 4.8% 95.9%',
    '--muted-foreground': '240 3.8% 46.1%',
    '--accent': '240 4.8% 95.9%',
    '--accent-foreground': '240 5.9% 10%',
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '0 0% 98%',
    '--border': '240 5.9% 90%',
    '--input': '240 5.9% 90%',
    '--ring': '240 5.9% 10%',
    '--radius': '0.5rem',
  },
});

globalStyle('.dark', {
  vars: {
    '--background': '240 10% 3.9%',
    '--foreground': '0 0% 98%',
    '--card': '240 10% 3.9%',
    '--card-foreground': '0 0% 98%',
    '--popover': '240 10% 3.9%',
    '--popover-foreground': '0 0% 98%',
    '--primary': '0 0% 98%',
    '--primary-foreground': '240 5.9% 10%',
    '--secondary': '240 3.7% 15.9%',
    '--secondary-foreground': '0 0% 98%',
    '--muted': '240 3.7% 15.9%',
    '--muted-foreground': '240 5% 64.9%',
    '--accent': '240 3.7% 15.9%',
    '--accent-foreground': '0 0% 98%',
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '0 0% 98%',
    '--border': '240 3.7% 15.9%',
    '--input': '240 3.7% 15.9%',
    '--ring': '240 4.9% 83.9%',
  },
});
`;

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
    console.log(green(`✓ Configuration saved to vextra.json`));

    const themeFullPath = path.join(process.cwd(), response.themePath);
    const themeDir = path.dirname(themeFullPath);

    await fs.mkdir(themeDir, { recursive: true });
    await fs.writeFile(themeFullPath, themeTemplate, 'utf-8');
    console.log(green(`✓ Theme file created at ${response.themePath}`));

    console.log(
      blue(`\nInitialization complete! You can now run "vextra add" to install components.`),
    );
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

    const componentUrl = `${REGISTRY_BASE_URL}/${component}.json`;
    const response = await fetch(componentUrl);

    if (!response.ok) {
      console.log(
        red(`\n✖ Component "${component}" not found in registry (HTTP ${response.status}).`),
      );

      console.log(yellow(`Check if your code is pushed to GitHub and the URL is correct:`));
      console.log(componentUrl);
      return;
    }

    const componentData = await response.json();
    const targetDir = path.join(process.cwd(), config.components);
    await fs.mkdir(targetDir, { recursive: true });

    for (const file of componentData.files) {
      const filePath = path.join(targetDir, file.name);
      await fs.writeFile(filePath, file.content, 'utf-8');
      console.log(green(`✓ Created ${file.name} in ${config.components}`));
    }

    if (componentData.dependencies && componentData.dependencies.length > 0) {
      console.log(blue(`\nInstalling dependencies for ${component}...`));

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
      console.log(blue('\nFetching available components...'));
      let availableComponents = [];

      try {
        const response = await fetch(`${REGISTRY_BASE_URL}/index.json`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        availableComponents = await response.json();
      } catch (error) {
        console.log(red('\n✖ Could not fetch component list from registry.'));
        console.log(yellow('Please check your network connection or repository URL.'));
        process.exit(1);
      }

      const choices = availableComponents.map((c: any) => {
        return { title: c.name, value: c.name };
      });

      const response = await prompts({
        type: 'multiselect',
        name: 'selected',
        message: 'Which components would you like to add?',
        choices: choices,
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
