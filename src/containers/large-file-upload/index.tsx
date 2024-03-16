import { useState } from 'react';
import './index.scss';
import axios from 'axios';
import { message } from 'antd';
import { generateRandomString } from 'utils/tool';

const id = "upload-file-engine";

const Index = () => {
  const [curFiles, setCurFiles] = useState<File[]>([]);
  const onChange = () => {
    const input: HTMLInputElement = document.querySelector(`#${id}`);
    const fileList: FileList = input.files;
    const files: File[] = [].slice.call(fileList);
    setCurFiles([...curFiles, ...files]);
    console.log('测试', files)
  }

  const beginUpload = (file: File) => {
    // 标示上传文件唯一性的uuid，通常使用文件名称和内容的哈希值，这里为了演示，先简单使用随机生成ID
    const fileId = generateRandomString(16);

    // 将文件切成一个个片段逐个上传到服务端
    const chunkSize = 5 * 1000 * 1000; // 每个片段的大小为5M并转换成byte
    const chunkTotal = Math.ceil(file.size / chunkSize); // 总片段数
    let chunkNo = 1; // 片段编号，从1开始上传，直到chunkTotal结束

    const upload = (_chunkNo: number) => {

      const formData = new FormData();

      // 例如第一个分片[0, 5000000)，第二个分片[5000000, 10000000)，第三个分片[10000000, 15000000)，以此类推
      const byteStartIndex = (_chunkNo - 1) * chunkSize;
      const byteEndIndex = _chunkNo * chunkSize;
      const chunk = file.slice(byteStartIndex, byteEndIndex); 

      formData.append('chunk', chunk);
      formData.append('chunkNo', String(chunkNo));
      formData.append('chunkTotal', String(chunkTotal));
      formData.append('fileId', fileId);

      axios.post('/api/upload', formData).then(res => {
        console.log('文件上传', res)
        if (res.data === 'success') {
          chunkNo++;
          if (chunkNo <= chunkTotal) {
            // 继续上传下一个分片
            upload(chunkNo);
          } else {
            // 最后一个分片完成上传，意味着上传结束
            message.success(`文件${file.name}上传成功`);
          }
        }
      }).catch(console.log)
    }

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
          {curFiles.map((file, index) => {
            return (
              <div key={index} className="selected-file-item">
                <span>{file.name}</span>
                <span>{file.size}(byte)</span>
                <button onClick={() => beginUpload(file)}>上传到远程</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Index;
