const fs = require('node:fs/promises');
const path = require('node:path');
const source = path.join('./04-copy-directory', '/files')
const folder = path.join('./04-copy-directory', '/files-copy')

async function deleteFolder() {
  try {
    const stats = await fs.stat(folder);
    if (stats.isDirectory()) {
      console.log('Folder already exists. Rewriting...');
      await fs.rm(folder, { recursive: true });
    }
  } catch (err) {
    console.log('Folder does not exist. Creating new folder...');
  }
}

async function copyFolder() {
  try {
    const createDir = await fs.mkdir(folder, { recursive: true });
    console.log(`Done: ${createDir}`);
    const contents = await fs.readdir(source);
    for (const file of contents) {
      await fs.copyFile(path.join(source, file), path.join(folder, file));
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function index() {
  try {
    await deleteFolder();
    await copyFolder();
  } catch (err) {
    console.error(err.message);
  }
}

index();