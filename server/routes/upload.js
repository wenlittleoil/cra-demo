const multer = require('multer');
const {
  beBasePath,
} = require('../constant');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const chunksDir = path.join(beBasePath, 'static/chunks');
const mergedDir = path.join(beBasePath, 'static/merged');

if (!fs.existsSync(chunksDir)) fs.mkdirSync(chunksDir);
if (!fs.existsSync(mergedDir)) fs.mkdirSync(mergedDir);

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, chunksDir);
  },
  filename: (req, file, cb) => {
    // chunk分片文件的临时名称
    const tempChunkName = uuid.v4();
    cb(null, tempChunkName)
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = app => {
  app.post(
    '/api/upload', 
    upload.single('chunk'), 
    async (req, res) => {
      let {
        chunkNo,
        chunkTotal,
        fileId,
        originalFileName,
      } = req.body;
      chunkNo = Number(chunkNo);
      chunkTotal = Number(chunkTotal);

      // chunk分片文件的临时路径（绝对路径），即multer.diskStorage配置filename时生成的临时名称
      const oldChunkPath = req.file.path; 
      // 将chunk分片文件重新按照完整文件ID和分片块编号命名，便于后续合并
      const newChunkPath = path.join(req.file.destination, `${fileId}-part${chunkNo}`); 
      fs.renameSync(oldChunkPath, newChunkPath);

      if (chunkNo === chunkTotal) {
        // 最后一个分片完成上传后，将所有相关分片合并成一个文件
        await mergeChunksToFile(fileId, chunkTotal, originalFileName);
      }
      
      res.send('success');
    }
  )
}

async function mergeChunksToFile(fileId, chunkTotal, originalFileName) {
  const filePath = path.join(mergedDir, `${fileId}-${originalFileName}`);
  const fileWriteStream = fs.createWriteStream(filePath);
  for (let i = 1; i <= chunkTotal; i++) {
    const chunkPath = path.join(chunksDir, `${fileId}-part${i}`); 
    const chunkBuffer = await fs.promises.readFile(chunkPath);
    fileWriteStream.write(chunkBuffer);
    // 所有相关chunks合并成文件后，删掉原chunk文件
    // fs.unlinkSync(chunkPath);
  }
}
