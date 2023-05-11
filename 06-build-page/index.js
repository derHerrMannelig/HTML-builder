const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const dist = path.join('./06-build-page', '/project-dist');
const template = path.join('./06-build-page', 'template.html');
const index = path.join('./06-build-page', '/project-dist', 'index.html');
const components = path.join('./06-build-page', '/components');
const style = path.join('./06-build-page', '/project-dist', 'style.css');
const styles = path.join('./06-build-page', '/styles');
const folder = path.join('./06-build-page', '/project-dist', '/assets');
const assets = path.join('./06-build-page', '/assets');

async function deleteDist() {
  try {
    const stats = await fsPromises.stat(dist);
    if (stats.isDirectory()) {
      console.log('Project folder already exists. Rewriting...');
      await fsPromises.rm(dist, { recursive: true });
    }
  } catch (err) {
    console.log('Project folder does not exist. Creating new folder...');
  }
}

async function createDist() {
  try {
    const createDir = await fsPromises.mkdir(dist, { recursive: true });
    console.log(`Done: ${createDir}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function createIndex() {
  try {
    data = await fsPromises.readFile(template, 'utf-8');
    await fsPromises.writeFile(index, data);
    console.log(`HTML created: ${index}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function applyTemplate() {
  try {
    let indexData = await fsPromises.readFile(index, 'utf-8');
    const componentsData = await fsPromises.readdir(components);
    const componentsFiles = componentsData.filter(file => {
      return file.endsWith('.html');
    });
    for (const file of componentsFiles) {
      // Чек на директорию с .html в конце.
      const filePath = path.join(components, file);
      const isDirectory = await fsPromises.stat(filePath);
      if (!isDirectory.isDirectory()) {
        const fileName = file.split('.')[0];
        const blockName = `{{${fileName}}}`;
        const fileData = await fsPromises.readFile(filePath, 'utf-8');
        indexData = indexData.split(blockName).join(`\n${fileData}\n`);
        console.log(`Detected component: ${filePath}`);
      } else {
        console.log(`This is a directory, not a valid component: ${filePath}`);
      }
    }
    await fsPromises.writeFile(index, indexData);
    console.log(`Templates (${components}) are applied.`);
  } catch(err) {
    console.error(err.message);
  }
}

async function createCss() {
  try {
    const data = '';
    await fsPromises.writeFile(style, data);
    console.log(`CSS created: ${style}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function populateCss() {
  try {
    const output = fs.createWriteStream(style, {flags: 'a', encoding: 'utf-8'});
    const contents = await fsPromises.readdir(styles);
    for (const file of contents) {
      const filePath = path.join(styles, file);
      const stats = await fsPromises.stat(filePath);
      if (stats.isFile() && file.endsWith('.css')) {
        const css = await fsPromises.readFile(filePath, 'utf-8');
        output.write(`${css}\n`);
        console.log(`Styles appended from: ${filePath}`);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function copyAssets() {
  try {
    await fsPromises.mkdir(folder, { recursive: true });
    const copyDir = async (src, dest) => {
      const files = await fsPromises.readdir(src);
      for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stats = await fsPromises.stat(srcPath);
        if (stats.isDirectory()) {
          await fsPromises.mkdir(destPath, { recursive: true });
          await copyDir(srcPath, destPath);
        } else {
          await fsPromises.copyFile(srcPath, destPath);
        }
      }
    };
    await copyDir(assets, folder);
    console.log(`Assets are in place: ${folder}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function execute() {
  try {
    await deleteDist();
    await createDist();
    await createIndex();
    await applyTemplate();
    await createCss();
    await populateCss();
    await copyAssets();
  } catch (err) {
    console.error(err.message);
  }
}

execute();
