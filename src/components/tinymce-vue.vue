<template>
  <div>
    <textarea 
    :id='id' 
    v-model='value' 
    :headers='header'>
    </textarea>
  </div>
</template>
 
<script>
export default {
  props: {
    value: String,
    path: String, // 上传图片的路径
    height: String // 编辑器的高度，使用组件时自己传，不穿下面设置了默认300
  },
  watch: {
    value(val) {
      if (window.tinymce.activeEditor) {
        if (
          this.status === 0 ||
          window.tinymce.activeEditor.getContent() !== val
        ) {
          if (val == null) {
            val = "";
          }
          window.tinymce.activeEditor.setContent(val);
        }
        this.status = 2;
      }
    }
  },
  data() {
    return {
      header: "",
      status: 0,
      id: "",
      setting: {
        // 配置富文本编辑器高
        height: this.height || 300
      },
      Url: "api/admin/upFile",
      maxSize: 11100000, // 文件大小
      accept: "image/jpeg, image/png, image/jpg", // 文件格式
      withCredentials: true
    };
  },
  created() {
    this.getheader();
    this.init();
  },
  mounted() {
    this.init();
  },
  methods: {
    getheader() {
      this.header = {
        Authorization: "Bearer " + localStorage.getItem("token")
      };
    },
    init() {
      const radomId = window.radomId ? window.radomId + 1 : 1;
      window.radomId = radomId;
      const _this = this;
      _this.status = 0;
      _this.id = "editor-" + radomId;
      const setting = {
        selector: "#" + _this.id,
        upload_image_url: "/upload/cloud", // 配置的上传图片的路由
        header: { token: localStorage.getItem("token") },
        language_url: "/static/tinymce/zh_CN.js",
        language: "zh_CN",
        init_instance_callback: function(editor) {
          editor.on("input change undo redo", () => {
            _this.$emit("input", editor.getContent());
          });
        },
        // 编辑器的一些简单样式设置
        content_style: `
    *                         { padding:0; margin:0; }
    html, body                { height:100%; }
    img                       { max-width:100%; display:block;height:auto; }
    a                         { text-decoration: none; }
    iframe                    { width: 100%; }
    p                         { line-height:1.6; margin: 0px; }
    table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
    .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
    ul,ol                     { list-style-position:inside; }
  `,
        insert_button_items: "image link | inserttable",
        paste_retain_style_properties: "all",
        paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: "all",
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,
        setup(editor) {
          // 添加自定义按钮，以及绑定事件
          editor.addButton("mybutton", {
            text: "高级编辑",
            icon: false,
            onclick() {
              window.open("http://www.135editor.com/");
            }
          });
        },
        plugins: [
          "advlist link image",
          "code",
          "insertdatetime media table textcolor contextmenu paste imagetools wordcount"
        ],
        toolbar_items_size: "small",
        block_formats:
          "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;",
        toolbar1:
          "table | insertfile undo redo | formatselect | uploadimg image media | link unlink | fontsizeselect | forecolor backcolor", // 工具栏1
        toolbar2:
          " fontselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | removeformat | mybutton ", // 工具栏2, mybutton是自己加的自定义按钮
        fontsize_formats: "10px 11px 12px 14px 16px 18px 20px 24px",
        font_formats: `
              微软雅黑=微软雅黑;
              宋体=宋体;
              黑体=黑体;
              仿宋=仿宋;
              楷体=楷体;
              隶书=隶书;
              幼圆=幼圆;
              Andale Mono=andale mono,times;
              Arial=arial, helvetica,
              sans-serif;
              Arial Black=arial black, avant garde;
              Book Antiqua=book antiqua,palatino;
              Comic Sans MS=comic sans ms,sans-serif;
              Courier New=courier new,courier;
              Georgia=georgia,palatino;
              Helvetica=helvetica;
              Impact=impact,chicago;
              Symbol=symbol;
              Tahoma=tahoma,arial,helvetica,sans-serif;
              Terminal=terminal,monaco;
              Times New Roman=times new roman,times;
              Trebuchet MS=trebuchet ms,geneva;
              Verdana=verdana,geneva;
              Webdings=webdings;
              Wingdings=wingdings,zapf dingbats`,
        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          if (blobInfo.blob().size > _this.maxSize) {
            failure("文件体积过大");
          }
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            uploadPic();
          } else {
            failure("图片格式错误");
          }
          function uploadPic() {
            let formData = new FormData();
            // 服务端接收文件的参数名，文件数据，文件名
            formData.append("img", blobInfo.blob(), blobInfo.filename());
            _this.$axios({
              method: "POST",
              // 这里是你的上传地址
              url: "api/admin/upFile",
              data: formData
            })
              .then(res => {
                // 这里返回的是你图片的地址
                success(res.data);
              })
              .catch(() => {
                failure("上传失败");
              });
          }
        }
      };
      Object.assign(setting, _this.setting);
      this.$nextTick(() => {
        window.tinymce.init(setting);
      });
    }
  },
  beforeDestroy: function() {
    window.tinymce.get(this.id).destroy();
  }
};
</script>
<style scoped lang="less" rel="stylesheet/less">
.tinymce {
  padding: 0;
}
.mce-panel {
  border: 0 solid #e8e8e8;
}
</style>
