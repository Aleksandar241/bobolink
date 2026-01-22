import { exec } from 'child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'fs';
import { join } from 'path';

const iconsOutputFolder = join(process.cwd(), 'src/theme/icons');
const iconsSourceFolder = join(process.cwd(), 'src/assets/icons');

// Clean up output folder (where generated icons go)
// Don't delete the 'config' folder or anything inside it
if (existsSync(iconsOutputFolder)) {
  const files = readdirSync(iconsOutputFolder);

  files.forEach(file => {
    const filePath = join(iconsOutputFolder, file);
    const isDir = statSync(filePath).isDirectory();

    // Skip 'config' folder completely - that's where template is
    if (file === 'config') {
      return;
    }

    // Only delete generated icon files, not config folder or its contents
    if (isDir) {
      rmSync(filePath, { recursive: true, force: true });
      console.log(`Deleted folder: ${filePath}`);
    } else if (!file.endsWith('.stories.tsx') && file.endsWith('.tsx')) {
      rmSync(filePath, { force: true });
      console.log(`Deleted file: ${filePath}`);
    }
  });
} else {
  console.log(`Output folder does not exist: ${iconsOutputFolder}`);
}

// Use existing template from src/theme/icons/config/icons-template.ts
const svgrCommand = `
npx @svgr/cli \
--ext tsx \
--out-dir src/theme/icons \
--template src/theme/icons/config/icons-template.ts \
-- src/assets/icons
`;

exec(svgrCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating icons: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`STDERR: ${stderr}`);
  }
  console.log(`STDOUT: ${stdout}`);
  console.log('Icons successfully generated!');

  // Format generated icon files (config folder is preserved)
  const prettierCommand = `npx prettier --write "src/theme/icons/*.tsx"`;

  exec(prettierCommand, (prettierError, prettierStdout, prettierStderr) => {
    if (prettierError) {
      console.error(`Error running Prettier: ${prettierError.message}`);
      return;
    }
    if (prettierStderr) {
      console.error(`Prettier STDERR: ${prettierStderr}`);
    }
    console.log(`Prettier output:\n${prettierStdout}`);
    console.log('All icon files formatted with Prettier!');

    // Run ESLint to fix issues
    const eslintCommand = `npx expo lint --fix src/theme/icons/*.tsx`;

    exec(eslintCommand, (eslintError, eslintStdout, eslintStderr) => {
      if (eslintError) {
        console.error(`Error running ESLint: ${eslintError.message}`);
        return;
      }
      if (eslintStderr) {
        console.error(`ESLint STDERR: ${eslintStderr}`);
      }
      console.log(`ESLint output:\n${eslintStdout}`);
      console.log('All icon files linted with ESLint!');
    });
  });
});