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
    const copyDir = async (src, dest) => {
      const files = await fs.readdir(src);
      for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stats = await fs.stat(srcPath);
        if (stats.isDirectory()) {
          await fs.mkdir(destPath, { recursive: true });
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    };
    await copyDir(source, folder);
    console.log(`Done: ${createDir}`);
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