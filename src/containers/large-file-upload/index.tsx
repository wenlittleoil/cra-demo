import { useState } from 'react';
import './index.scss';

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
  return (
    <div className="large-file-upload-page">
      <div>
        <label htmlFor={id} className="upload-file-btn">上传文件</label>
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
                <button>上传到远程</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Index;
