```javascript
import { Button, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import _ from 'lodash-es';
import pLimit from 'p-limit';
import SparkMD5 from 'spark-md5';
import { useState } from 'react';
// import { config as iceConfig } from 'ice';
import styles from './index.module.less';

// const { BASE_URL } = iceConfig;

export interface ProFormUploadButtonProps {
  /**
   * @description 按钮文字
   * @default 上传
   * @example  title="上传"
   * @example  title={<div>上传</div>}
   */
  title?: string;
  /**
   * @description 上传后端的字段名字
   * @default file
   * @example  name="upload"
   */
  name?: string;
  /**
   * @description 发动请求的地址
   * @example requireAction='http://192.168.1.200:2231'
   */
  requireAction?: string;
  /**
   * @description 最小切片大小(以M为单位)
   * @default 5
   * @example  minSliceSize=5
   */
  minSliceSize?: number;
  /**
   * @description 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
   * @default 5M
   * @example  listType="5"
   */
  listType?: string | any;
  /**
   * @description 切片上传的并发数量，默认为6个
   * @default 6
   * @example  limitRequire="6"
   */
  limitRequire?: number;
  /**
   * @description 增加类名
   */
  className?: string | any;
  /**
   * @description 有关于Upload上传的其他属性，请参考antD
   */
  fieldProps?: any;
  /**
   * @description 有关于Form.Item上传的其他属性，请参考antD
   */
  formItemFieldProps?: any;
  /**
   * @description 插槽节点
   */
  children: any;
}
/**
 * @description 获取文件返回的基本参数
 * @param {File} file 文件对象
 */
const changeBuffer = (file: File) => {
  return new Promise((resolve, reject) => {
    /* 阅读文件信息 */
    const fileReader = new FileReader();
    /* 读取文件的一个操作 */
    fileReader.readAsArrayBuffer(file);
    /* 文件全部读取完的一个操作 */
    fileReader.onload = (ev) => {
      const buffer = ev.target?.result;
      const spark = new SparkMD5.ArrayBuffer();
      let HASH = '';
      let suffix = '';
      spark.append(buffer);
      /* 得到文件名 */
      HASH = spark.end();
      /* 获取后缀名 */
      suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];

      console.log(HASH, suffix, spark);

      /* 获取一些参数 */
      const fileName = file.name; // 文件名
      const fileLength = file.size; // 文件总大小

      resolve({
        buffer,
        fileName,
        HASH,
        fileLength,
      });
    };
    /* 文件读取失败的操作 */
    fileReader.onerror = function () {
      reject('文件读取失败');
      message.error('文件读取错误');
    };
  });
};

/**
 * @description: 获取基础配置参数
 * @param {*} fileLength 文件大小
 * @param {*} fileName 文件名
 * @param {*} DEFAULT_CHUNK_SIZE // 默认单个切片大小
 */
const getInitConfig = async (
  fileLength: any,
  fileName: string,
  requireAction: string,
  HASH: string,
  DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024,
  uploadIdAndErrorId: string,
) => {
  // 数据基本化配置
  let result;
  try {
    const res = await axios.post(
      `${requireAction}/fileupload/upload/init`,
      {
        appCode: 'gongluUpload',
        uploadCode: 'gongluFastDFS',
        fileName,
        fileLength,
        uploadId: uploadIdAndErrorId[`${fileName}${fileLength}`] || '', // 用于断点续传的功能
        expectChunkCount: Math.ceil(fileLength / DEFAULT_CHUNK_SIZE), // 假设以5M为单位设置总的切片大小
      },
      {
        headers: {
          token: localStorage.getItem('token'),
        },
      },
    );
    result = res.data.data;
    return {
      reqUrlList: _.map(_.get(result, 'chunkInfoList'), (item, index) => ({
        chunkIndex: index,
        uploadUrl: item.uploadUrl,
        isCompleted: item.isCompleted,
      })), // 获取请求路径
      uploadId: _.get(result, 'internalUploadId'), // 获取签名uploadId
    };
  } catch (error) {
    console.error(error, '获取基本化配置失败');
  }
  return false;
};

/**
 * @description: 创建文件切片
 * @param {*} file
 */
const createChunks = (file: any, chunkSize = 5 * 1024 * 1024) => {
  console.log(file, file.name, 164);
  let fileChunkList: any = [];
  let cur = 0;
  while (cur < file.size) {
    fileChunkList = _.concat(fileChunkList, file.slice(cur, cur + chunkSize));
    cur += chunkSize;
  }
  console.log(fileChunkList, 171);
  const _fileChunkList = fileChunkList.map((item: any) => {
    return new Blob([item], { type: '' });
  });
  console.log(_fileChunkList, 174);
  return _fileChunkList;
};

/**
 * @description: 完成切片合并的操作
 * @param {*} config 相关的配置
 */
const completeMerge = async (config: any) => {
  const { chunksCount, reqUrlList, requireAction, uploadId: _uploadId, fileName, fileLength } = config;
  if (chunksCount < reqUrlList.length) {
    return false;
  }

  try {
    await axios.post(
      `${requireAction}/fileupload/upload/complete`,
      { uploadId: _uploadId },
      {
        headers: {
          token: localStorage.getItem('token'),
        },
      },
    );
  } catch (error) {
    console.error(error, '操作失败');
  }
  /*  如果最后成功断点续传对应的标记去掉 */
  return { fileName, fileLength };
};

/**
 * @description: 文件切片上传
 * @param {*} config 切片的相关配置
 * @param {*} successCallback 成功的回调
 * @param {*} failCallback 失败的回调
 */
const uploadSlice = async (config: any, successCallback: any, failCallback: any) => {
  let { fileChunksList, reqUrlList, requireAction, uploadId, limitRequire, fileName, fileLength, uploadIdAndErrorId } =
    config;
  if (fileChunksList.length < 1) {
    return false;
  }
  /* 加载失败后用于断点续传的功能 */
  const reUpload = () => {
    let chunks: any = [];
    _.forEach(reqUrlList, (item) => {
      if (!item.isCompleted) {
        chunks = _.concat(chunks, fileChunksList[item.chunkIndex]);
      }
    });
    const urls = _.filter(reqUrlList, (item) => !item.isCompleted);
    return {
      urls, // 失败的时候的上传路径
      chunks, // 失败的时候的切片模块
    };
  };
  if (uploadIdAndErrorId[fileName + fileLength]) {
    const { urls, chunks } = uploadIdAndErrorId[fileName + fileLength] && reUpload();
    reqUrlList = urls;
    fileChunksList = chunks;
  }
  let chunksCount = 0;
  const limit = pLimit(limitRequire);
  reqUrlList = _.map(reqUrlList, (item) => item.uploadUrl);
  // console.log(reqUrlList, 207);
  let uploadQueue: any = [];
  _.forEach(fileChunksList, async (chunk, chunkIndex) => {
    const formData = new FormData();
    formData.append('file', chunk);
    try {
      console.log(reqUrlList[chunkIndex], 210);
      uploadQueue = _.concat(
        uploadQueue,
        limit(() =>
          axios({
            method: 'put',
            url: `http://${reqUrlList[chunkIndex]}`,
            data: formData,
            timeout: 90 * 1000, // 90s超时时间
          })
            .then(() => {})
            .catch((error) => {
              failCallback(uploadId, chunk); // 错误时候返回id和对应chunk
              throw `${error} 单个切片上传中断或失败`;
            }),
        ),
      );
    } catch (error) {
      throw `${error} 单个切片上传失败`;
    }
    await Promise.all(uploadQueue);
    // 用于模块计数
    chunksCount++;
    successCallback(chunksCount, reqUrlList);
    const endConfig = {
      chunksCount, // 单个切片上传的计数数量
      reqUrlList, // 总请求路径数量
      requireAction, // 接口上传的地址
      uploadId, // 签名upload
      fileName, // 文件名
      fileLength, // 文件大小
    };
    return completeMerge(endConfig);
  });
};


/* 入口函数 */
const Index: React.FC<ProFormUploadButtonProps> = (props: any) => {
  /* 这边可以设置全局默认参数 */
  const {
    name = 'file',
    title = '上传',
    requireAction = 'http://192.168.1.86:2231',
    listType = 'picture',
    minSliceSize = 0.25,
    limitRequire = 2,
    fieldProps,
    formItemFieldProps,
    className,
    children,
  } = props;
  /* 当前文件上传的状态 done为已上传完毕，uploading正在上传 */
  const [uploadStatus, setUploadStatus] = useState<string>('done');
  /* 切片上传进度详情 */
  const [sliceProgressDetail, setSliceProgressDetail] = useState<number>(0);
  /* 用于上传的签名(也用于断点续传的签名Id) */
  const [uploadIdAndErrorId, setUploadIdAndErrorId] = useState<any>({});
  /* 文件上传前进行的一系列操作 */
  const customRequest = async (option: any) => {
    /* 先判断下有没有断点续传的文件 */
    const _file = option.file as File;
    /* 要处理的文件数据 */
    const { fileName, HASH, fileLength }: any = await changeBuffer(_file); // 处理文件的数据
    /* 默认切片大小 */
    const DEFAULT_CHUNK_SIZE = minSliceSize * 1024 * 1024;
    const { reqUrlList, uploadId }: any = await getInitConfig(
      fileLength,
      fileName,
      requireAction, // 后台接口请求的地址
      HASH,
      DEFAULT_CHUNK_SIZE,
      uploadIdAndErrorId, // 有上传的错误uploadId则以这个为准
    );
    /* 获取分割好的切片(总切片) */
    const fileChunksList = await createChunks(_file, DEFAULT_CHUNK_SIZE);
    console.log(fileChunksList, 319);
    /* 上传切片 */
    const res = await uploadSlice(
      {
        fileChunksList, // 切片模块
        reqUrlList, // 切片分块地址
        requireAction, // 后台接口请求的地址
        uploadId, // 签名id
        limitRequire, // 上传的并发数量
        fileName, // 文件名
        fileLength, // 文件大小
        uploadIdAndErrorId, // 文件上传错误集合
      },
      /* 成功 */
      (count: number, handleReqUrl: string) => {
        /* 获取计数 */
        setSliceProgressDetail(Math.round((count / handleReqUrl.length) * 100));
        if (count === handleReqUrl.length) {
          // setSliceProgressDetail(0);
          setUploadStatus('done');
          option.onSuccess(res);
        }
      },
      /* 失败 */
      (_uploadId: string) => {
        setSliceProgressDetail(0); /* 进度跳为0 */
        setUploadStatus('error');
        setUploadIdAndErrorId({ ...uploadIdAndErrorId, [fileName + fileLength]: _uploadId }); /* 失败的uploadId */
        option.onError(res);
      },
    );
    /* 断点续传重新上传时，清除一次标记 */
    if (uploadIdAndErrorId[`${fileName}${fileLength}`]) {
      setUploadIdAndErrorId({ ...uploadIdAndErrorId, [fileName + fileLength]: null });
    }
  };
  /* 上传前的控制 */
  const changeUpload = (file: any) => {
    setUploadStatus(file.file.status);
    return false;
  };
  /* 上传前的处理 */
  const beforeUpload = () => {
    if (uploadStatus === 'uploading') {
      message.warning('请勿连续上传文件，等待中...');
      return Upload.LIST_IGNORE;
    }
  };
  /* 垃圾桶撤销 */
  const removeUpload = (file: any) => {
    if (file.status === 'uploading') {
      message?.warning('文件正在上传中，请稍后...');
      return false;
    }
  };
  return (
    <>
      <Form.Item name={name} {...formItemFieldProps} className={className}>
        <Upload
          className={styles.upload}
          listType={listType}
          progress={{
            strokeWidth: 3,
            format: (percent) => `${percent}%`,
          }}
          onChange={changeUpload}
          onRemove={removeUpload}
          customRequest={customRequest}
          beforeUpload={beforeUpload}
          itemRender={(originNode, file) => {
            file.percent = sliceProgressDetail;
            return originNode;
          }}
          {...fieldProps}
        >
          <Button icon={<UploadOutlined />}>{title}</Button>
          {children}
        </Upload>
      </Form.Item>

      {/* <Form.Item name={name} {...formItemFieldProps} className={className}>
        <Upload.Dragger
          className={styles.upload}
          name={title}
          listType={listType}
          progress={{
            strokeWidth: 3,
            format: (percent) => `${percent}%`,
          }}
          onChange={changeUpload}
          onRemove={removeUpload}
          customRequest={customRequest}
          beforeUpload={beforeUpload}
          itemRender={(originNode, file) => {
            file.percent = sliceProgressDetail;
            return originNode;
          }}
          {...fieldProps}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          {children}
        </Upload.Dragger>
      </Form.Item> */}
    </>
  );
};
export default Index;
```
