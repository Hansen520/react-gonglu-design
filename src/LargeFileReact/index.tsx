/*
 * @Date: 2024-03-18 15:43:18
 * @Description: description
 */
import { Button } from 'antd';
import axios from 'axios';
// import pLimit from 'p-limit';
import { ChangeEvent, useRef, useState } from 'react';

const SIZE = 1024 * 1024 * 10; // 切片大小，这里设置为10MB
enum Status {
  wait = 'wait',
  pause = 'pause',
  uploading = 'uploading',
  done = 'done',
}

interface Data {
  fileHash?: string;
  index?: number;
  hash?: string;
  chunk?: Blob;
  size?: number;
  percentage?: number;
}

function LargeFileReact() {
  /* 文件的数据 */
  const [file, setFile] = useState<File>(); // 文件信息
  const [status, setStatus] = useState<Status>(); // 当前上传的状态
  const [hashPercentage, setHashPercentage] = useState<number>(0); // 文件的hash值
  const refData = useRef<{ fileHash: string; data: Data[]; worker: any }>({
    fileHash: '',
    data: [],
    worker: null,
  });

  /* 选择文件 */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files![0]);
    const file = event.target.files![0];
    if (!file) return;
    setFile(file);
  };

  /* 创建切片  */
  const createFileChunk = (file: File, size: number = SIZE) => {
    const fileChunkList: { file: Blob }[] = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  };

  /* 计算文件的hash信息 */
  const calculateHash = (fileChunkList: { file: Blob }[]) => {
    return new Promise((resolve: (e: string) => void) => {
      /* 采用工作线程来给文件hash */
      const worker = new Worker('/hash-worker.js');
      worker.postMessage({ fileChunkList });
      worker.onmessage = (e: any) => {
        const { percentage, hash } = e.data;
        setHashPercentage(percentage);
        if (hash) resolve(hash);
      };
      refData.current.worker = worker;
    });
  };

  // 根据hash验证文件是否曾经被上传过，没有才进行上传
  const verifyUpload = async (filename: string, fileHash: string) => {
    const { data } = await axios.post(
      'http://localhost:3000/verify',
      JSON.stringify({ filename, fileHash }),
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    return data;
  };

  // 用闭包保存每个 chunk 的进度数据
  const createProgressHandler = (item: any) => {
    setStatus(Status.uploading);
    return (e: any) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100));
    };
  };

  // 合并
  const mergeRequest = async () => {
    await axios.post(
      'http://localhost:3000/merge',
      {
        size: SIZE,
        fileHash: refData.current.fileHash,
        filename: file!.name,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    setStatus(Status.done);
    console.log('合并成功');
  };

  // 上传切片
  const uploadChunks = async (uploadedList: any = []) => {
    // const limit = pLimit(6);
    const requestList = refData.current?.data
      // hash为每一个chunk重新排序后的hash
      ?.filter(({ hash }) => !uploadedList.includes(hash))
      .map(({ chunk, hash, index }: any) => {
        // 每一个的
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash); // 单个的
        formData.append('filename', file!.name);
        formData.append('fileHash', refData.current.fileHash); // 文件的
        // console.log(formData, chunk, hash, file!.name, 115);
        return { formData, index };
      })
      .map(({ formData, index }) =>
        axios.post('http://localhost:3000', formData, {
          onUploadProgress: createProgressHandler(refData.current?.data[index]),
        }),
      ) as [];
    await Promise.all(requestList);
    if (
      uploadedList.length + requestList.length ===
      refData.current?.data!.length
    ) {
      await mergeRequest();
    }
  };

  // 点击按钮上传
  const handleUpload = async () => {
    if (!file) return;
    setStatus(Status.wait);
    /* 获取切片 */
    const fileChunkList = createFileChunk(file);
    /* 完成加载切片后获取最后的hash值 */
    const fileHash = await calculateHash(fileChunkList);
    refData.current['fileHash'] = fileHash; // 就是完成后的hash
    // 验证是否已经上传的信息
    const { shouldUpload, uploadedList } = await verifyUpload(
      file.name,
      fileHash,
    );

    if (!shouldUpload) {
      console.log('文件已上传');
      setStatus(Status.wait);
      return;
    }
    // 处理些每个块
    const data = fileChunkList.map(
      ({ file }: { file: Blob }, index: number) => ({
        fileHash, // 文件hash
        index,
        hash: fileHash + '-' + index, // 每一个块的hash
        chunk: file,
        size: file.size,
        percentage: uploadedList.includes(index) ? 100 : 0,
      }),
    );
    refData.current['data'] = data;
    await uploadChunks(uploadedList as any);
  };

  const handleDelete = async () => {
    const { data } = await axios.post('http://localhost:3000/delete');
    if (data.code === 0) {
      alert('删除成功');
    }
  };

  const resetData = () => {
    // requestList
    if (refData.current.worker) {
      refData.current.worker.onmessage = null;
    }
  };

  const handlePause = async () => {
    setStatus(Status.pause);
    resetData();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>上传</Button>
      <Button onClick={handleDelete}>删除</Button>
      <Button onClick={handlePause}>暂停</Button>
      当前文件的状态:{status}
      文件正在hash中:{hashPercentage}
    </div>
  );
}

export default LargeFileReact;
