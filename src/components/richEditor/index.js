import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

export default class Index extends React.Component {

  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null)
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    // 假设此处从服务端获取html格式的编辑器内容
    //const htmlContent = await fetchEditorContent()
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // this.setState({
    //     editorState: BraftEditor.createEditorState('')
    // })
  }

  submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    console.log('--htmlContent--', htmlContent);
    //const result = await saveEditorContent(htmlContent)
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  myUploadFn = (param) => {
    // console.log('param',param);
    const serverURL = '/smart_ward_admin/restapi/v1/file/upload';//upload 是接口地址
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      //console.log('response', response.currentTarget);
      //console.log('xhr.responseText', xhr.responseText);
      const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
      param.success({
        url: JSON.parse(xhr.responseText).data,
        meta: {
          id: upLoadObject && upLoadObject.id,
          title: upLoadObject && upLoadObject.fileName,
          alt: upLoadObject && upLoadObject.fileName,
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: false, // 指定音视频是否显示控制栏
          poster: '', // 指定视频播放器的封面
        }
      })
    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败！'
      })
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    // xhr.setRequestHeader("X-Auth-Token", User.getToken());//header中token的设置
    xhr.send(fd)
  }

  // 不允许添加尺寸大于500MB的文件
  myValidateFn = (file) => {
    return file.size < 1024 * 1024 * 500
  }

  mediaAccepts = () => {
    return {
      image: 'image/png, image/jpg',
      video: 'video/mp4',
      audio: 'audio/mp3'
    }
  }

  insertMediItem = () => {
    // 使用ContentUtils.insertMedias来插入媒体到editorState
    const editorState = ContentUtils.insertMedias(this.state.editorState, [
      {
        type: 'AUDIO',
        url: 'http://10.20.222.231:8010/group1/M00/00/11/ChTe514JakiAEj98AGQkdnzzog8926.mp3'
      },
      {
        type: 'VIDEO',
        url: 'http://10.20.222.231:8010/group1/M00/00/11/ChTe514JcAqAMA_pAA1n5PKxGxo750.mp4'
      },
    ])

    // 更新插入媒体后的editorState
    this.setState({ editorState })
  }

  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }
    window.previewWindow = window.open()
    window.previewWindow.document.write(this.buildPreviewHtml())
    window.previewWindow.document.close()
  }

  getEditorHtml = () => {
    return this.buildPreviewHtml();
  }

  getEditorContent = () => {
    return this.state.editorState.toHTML();
  }

  setEditorContent = (text) => {
    this.setState({
      editorState: BraftEditor.createEditorState(text)
    });
  }

  buildPreviewHtml() {
    return `
      <!Doctype html>
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
          <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 24px;
              overflow: hidden;
              background-color: #fff;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
            }
            .container p{
              white-space: pre-wrap;
							min-height: 1em;
							margin: 0;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
          <script type="text/javascript">
            const setMedia = function (video, scale = 0.8) {
            video.addEventListener('loadeddata', function (e) {
              let canvas = document.createElement('canvas');
              canvas.width = video.videoWidth * scale;
              canvas.height = video.videoHeight * scale;
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
              let src = canvas.toDataURL('image/png');
              (function (flag = true) {
                if (!flag) { return; }
                let img = document.createElement('img');
                img.src = src;
                document.body.appendChild(img);
                })(0);
                video.setAttribute('poster', src);
              });
            };
            let videos = document.querySelectorAll('video');
            videos.forEach((video) => {
              video.innerHTML=<source src=video.src type="video/mp4">;
              setMedia(video);
            });
          </script>
        </body>
      </html>
    `;
  }

  render() {
    const { editorState } = this.state;
    // const extendControls = [
    //   'separator',
    //   {
    //     key: 'insert-media',
    //     type: 'button',
    //     text: '插入音视频',
    //     onClick: this.insertMediItem
    //   },
    //   {
    //     key: 'custom-button',
    //     type: 'button',
    //     text: '预览',
    //     onClick: this.preview
    //   }
    // ];
    const excludeControls = ['undo', 'redo', 'underline', 'strike-through', 'superscript', 'subscript', 'emoji', 'link', 'separator', 'code', 'blockquote'];
    return (
      <div className="braft-component">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          // extendControls={extendControls}
          excludeControls={excludeControls}
          onSave={this.submitContent}
          media={{ uploadFn: this.myUploadFn, validateFn: this.myValidateFn, accepts: this.mediaAccepts }}
        />
      </div>
    )
  }
}