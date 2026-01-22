#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.join(rootDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const featuresDir = path.join(srcDir, 'features');

// Helper function to ask questions
const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

// Helper function to capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper function to get component name in PascalCase
const getComponentName = (name) => {
  return name
    .split(/[-_\s]/)
    .map((word) => capitalize(word))
    .join('');
};

// Get list of features
const getFeatures = () => {
  if (!fs.existsSync(featuresDir)) {
    return [];
  }
  return fs
    .readdirSync(featuresDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

// Template functions
const getIndexTemplate = (componentName) => `export * from './${componentName}.view';
export * from './types';
`;

const getViewTemplate = (componentName) => `import React from 'react';
import { styles } from './styles';
import type { ${componentName}Props } from './types';
import { useViewModel } from './useViewModel';

export const ${componentName}: React.FC<${componentName}Props> = ({}) => {
  const viewModel = useViewModel({
    // TODO: Add view model props here
  });

  return <>{/* TODO: Add content */}</>;
};
`;

const getViewModelTemplate = (componentName) => `import { ViewModelProps } from './types';

export function useViewModel(props: ViewModelProps) {
  // TODO: Add logic here
  return {};
};
`;

const getTypesTemplate = (componentName) => `import { StyleProp, ViewStyle } from 'react-native';

export type ${componentName}Props = Readonly<{
// TODO: Add props here
}>;

export type ViewModelProps = Readonly<{
// TODO: Add view model props here
}>;
`;

const getStylesTemplate = () => `import { StyleSheet } from '@/src/theme';

export const styles = StyleSheet.create(({  }) => ({
    // TODO: Add styles
}));
`;

// Create component files
const createComponent = async () => {
  try {
    // Question 1: Component name
    const componentNameInput = await question('What is your component name? ');
    if (!componentNameInput.trim()) {
      console.error('❌ Component name is required');
      process.exit(1);
    }

    const componentName = getComponentName(componentNameInput.trim());
    const componentNameLower = componentName.charAt(0).toLowerCase() + componentName.slice(1);

    // Question 2: Is it global?
    const isGlobalAnswer = await question('Is it global? (y/n) ');
    const isGlobal = isGlobalAnswer.toLowerCase().trim() === 'y' || isGlobalAnswer.toLowerCase().trim() === 'yes';

    let targetDir;

    if (isGlobal) {
      targetDir = path.join(componentsDir, componentName);
    } else {
      // Question 3: Select feature
      const features = getFeatures();
      
      if (features.length === 0) {
        console.error('❌ No features found. Please create features folder first.');
        process.exit(1);
      }

      console.log('\nAvailable features:');
      features.forEach((feature, index) => {
        console.log(`  ${index + 1}. ${feature}`);
      });

      const featureAnswer = await question('\nSelect which feature? (enter number) ');
      const featureIndex = parseInt(featureAnswer.trim(), 10) - 1;

      if (isNaN(featureIndex) || featureIndex < 0 || featureIndex >= features.length) {
        console.error('❌ Invalid feature selection');
        process.exit(1);
      }

      const selectedFeature = features[featureIndex];
      targetDir = path.join(featuresDir, selectedFeature, 'components', componentName);
    }

    // Create directory
    if (fs.existsSync(targetDir)) {
      console.error(`❌ Component ${componentName} already exists at ${targetDir}`);
      process.exit(1);
    }

    fs.mkdirSync(targetDir, { recursive: true });

    // Create files
    const files = [
      { name: 'index.ts', content: getIndexTemplate(componentName) },
      { name: `${componentName}.view.tsx`, content: getViewTemplate(componentName) },
      { name: 'useViewModel.ts', content: getViewModelTemplate(componentName) },
      { name: 'types.ts', content: getTypesTemplate(componentName) },
      { name: 'styles.ts', content: getStylesTemplate() },
    ];

    files.forEach(({ name, content }) => {
      const filePath = path.join(targetDir, name);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created ${name}`);
    });

    console.log(`\n✅ Component ${componentName} created successfully at ${path.relative(rootDir, targetDir)}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createComponent();

