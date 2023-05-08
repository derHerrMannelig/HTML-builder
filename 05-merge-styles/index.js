const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');
const bundle = path.join('./05-merge-styles', '/project-dist', 'bundle.css')
const source = path.join('./05-merge-styles', '/styles')

async function deleteBundle() {
  try {
    const stats = await fsPromises.stat(bundle);
    if (stats.isFile()) {
      console.log('Bundle already exists. Rewriting...');
      await fsPromises.rm(bundle);
    }
  } catch (err) {
    console.log('Bundle does not exist. Creating new bundle...');
  }
}

async function createBundle() {
  try {
    const data = '';
    await fsPromises.writeFile(bundle, data);
    console.log(`Done: ${bundle}`);
  } catch (err) {
    console.error(err.message);
  }
}

async function populateBundle() {
  try {
    const output = fs.createWriteStream(bundle, {flags: 'a', encoding: 'utf-8'});
    const contents = await fsPromises.readdir(source);
    for (const file of contents) {
      const filePath = path.join(source, file);
      const stats = await fsPromises.stat(filePath);
      if (stats.isFile() && file.endsWith('.css')) {
        const styles = await fsPromises.readFile(filePath, 'utf-8');
        output.write(`${styles}\n`);
        console.log(`Styles appended from: ${filePath}`);
      }
    }

  } catch (err) {
    console.error(err.message);
  }
}

async function index() {
  try {
    await deleteBundle();
    await createBundle();
    await populateBundle();
  } catch (err) {
    console.error(err.message);
  }
}

index();