
const Index = () => {
  const onChange = () => {
    const input: HTMLInputElement = document.querySelector('input');
    const fileList: FileList = input.files; 
    console.log('上传的文件列表', fileList);
    const blob = fileList[0];
    const video = document.querySelector('video');
    video.src = URL.createObjectURL(blob);
  }
  return (
    <div className="video2-page">
      <div><input type="file" onChange={onChange} /></div>
      <div><video controls width={400} height={400} style={{ objectFit: 'contain' }} /></div>
    </div>
  )
}

export default Index;
