import { useState } from 'react';
import './index.scss';
import axios from 'axios';
import { Progress, message } from 'antd';
import { generateRandomString } from 'utils/tool';

const id = "upload-file-engine";

enum EUploadStatus {
  ready = 'ready',
  uploading = 'uploading',
  paused = 'paused',
  completed = 'completed',
}

type FileWithUploadInfo = {
  originalFile: File,
  // 标示上传文件唯一性的uuid，通常使用文件名称和内容的哈希值
  fileId: string,
  // 文件上传状态
  uploadStatus: EUploadStatus,
  // 文件上传进度，从0到1，小数点后两位精度
  uploadProgress: number
}

const Index = () => {
  const [curFiles, setCurFiles] = useState<FileWithUploadInfo[]>([]);
  const onChange = () => {
    const input: HTMLInputElement = document.querySelector(`#${id}`);
    const fileList: FileList = input.files;
    const originalFiles: File[] = [].slice.call(fileList);
    const customFiles = originalFiles.map((item: File) => ({
      originalFile: item,
      fileId: generateRandomString(16), // 这里为了演示，先简单使用随机生成ID
      uploadStatus: EUploadStatus.ready,
      uploadProgress: 0,
    }))
    setCurFiles([...curFiles, ...customFiles]);
  }

  const beginUpload = (customFile: FileWithUploadInfo) => {
    const file: File = customFile.originalFile;

    // 将文件切成一个个片段逐个上传到服务端
    const chunkSize = 5 * 1000 * 1000; // 每个片段的大小为5M并转换成byte
    const chunkTotal = Math.ceil(file.size / chunkSize); // 总片段数
    let chunkNo = 1; // 片段编号，从1开始上传，直到chunkTotal结束

    const uploadChunk = (_chunkNo: number) => {
      // 例如第一个分片[0, 5000000)，第二个分片[5000000, 10000000)，第三个分片[10000000, 15000000)，以此类推
      const byteStartIndex = (_chunkNo - 1) * chunkSize;
      const byteEndIndex = _chunkNo * chunkSize;
      const chunk = file.slice(byteStartIndex, byteEndIndex); 

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkNo', String(chunkNo));
      formData.append('chunkTotal', String(chunkTotal));
      formData.append('fileId', customFile.fileId);
      // 切成分片后，服务端不知道完整文件的原始名称和扩展，需要从前端传递过去
      formData.append('originalFileName', customFile.originalFile.name);

      axios.post('/api/upload', formData).then(res => {
        console.log('文件分片上传', res)
        if (res.data === 'success') {
          chunkNo++;

          setCurFiles(prevList => prevList.map(item => {
            if (item.fileId === customFile.fileId) {
              return {
                ...item,
                uploadStatus: EUploadStatus.uploading,
                uploadProgress: Math.floor((chunkNo / chunkTotal) * 100) / 100,
              }
            }
            return item;
          }));

          if (chunkNo <= chunkTotal) {
            // 继续上传下一个分片
            uploadChunk(chunkNo);
          } else {
            // 最后一个分片完成上传，意味着上传结束
            message.success(`文件${file.name}上传成功`);
          }
        }
      }).catch(console.log);
    }

    // 启动上传
    uploadChunk(chunkNo);

  }
   
  return (
    <div className="large-file-upload-page">
      <div>
        <label htmlFor={id} className="upload-file-btn">选中文件</label>
        <input 
          type="file" 
          id={id} 
          multiple 
          style={{
            display: "none",
            // visibility: "hidden",
            // opacity: 0,
          }}
          onChange={onChange}
        />
      </div>

      <div className="selected">
        <div>已经选中{curFiles.length}个文件</div>
        <div className="selected-file-list">
          {curFiles.map((customFile, index) => {
            const file = customFile.originalFile;
            const status = customFile.uploadStatus;
            const pgStyle = { width: '300px' }
            return (
              <div key={index} className="selected-file-item">
                <span>{file.name}</span>
                <span>{file.size}(byte)</span>

                {status === EUploadStatus.ready && (
                  <button onClick={() => beginUpload(customFile)}>上传到远程</button>
                )}

                {/* 测试分片上传 */}
                {status !== EUploadStatus.ready && (
                  <Progress style={pgStyle} percent={customFile.uploadProgress * 100} />
                )}

                {/* 测试断点续传 */}
                {/* {status === EUploadStatus.uploading && (
                  <div>
                    <Progress style={pgStyle} percent={customFile.uploadProgress * 100} />
                    <button>暂停</button>
                  </div>
                )}
                {status === EUploadStatus.paused && (
                  <div>
                    <Progress style={pgStyle} percent={customFile.uploadProgress * 100} />
                    <button>继续</button>
                  </div>
                )}
                {status === EUploadStatus.completed && (
                  <div>
                    <Progress style={pgStyle} percent={customFile.uploadProgress * 100} />
                    <div>上传完成！</div>
                  </div>
                )} */}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Index;
