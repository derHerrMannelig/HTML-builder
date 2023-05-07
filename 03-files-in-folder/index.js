const fs = require('node:fs/promises');
const path = require('node:path');

async function filesInFolder() {
  try {
    const files = await fs.readdir(path.join('./03-files-in-folder', '/secret-folder'), {withFileTypes: true});
    for (const file of files)
    if (file.isDirectory() === false) {
      const fileStat = await fs.stat(path.join('./03-files-in-folder', '/secret-folder', file.name))
      const size = (fileStat.size/1024).toFixed(3) + 'kb'
      console.log(file.name.split(".")[0] + ' - ' + path.extname(file.name).slice(1) + ' - ' + size);
    }
  } catch (err) {
    console.error(err);
  }
}

filesInFolder();
