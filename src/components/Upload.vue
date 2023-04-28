<template>
<div class="gislife-upload-wrapper"
  v-uploading="getProgressSetter">
  <div class="gislife-upload-fake-wrapper">
    <span class="gislife-upload-fake__button">
      选择文件
    </span>
    <ol class="gislife-upload-fake__file">
      <li v-for="fileName in filesName"
        :key="fileName"
        class="gislife-upload-fake__file-item">
        <EllipsisCenter :text="fileName" />
      </li>
    </ol>
    <span v-show="startUpload"
      class="gislife-upload-fake__progress">
      {{progressPercent}}
    </span>
  </div>
  <input type="file"
    class="gislife-upload__rawInput"
    :accept="accept"
    :multiple="multiple"
    @input="handleFileSelect" />
</div>
</template>

<script>
  import FakeProgress from 'fake-progress';
  import EllipsisCenter from './EllipsisCenter.vue';


  export default {
    name: "Upload",
    components: { EllipsisCenter },
    props: {
      fakeOptions: Object,
      fileName: String,
      accept: {
        type: String,
        default: '.doc,.docx'
      },
      multiple: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        progress: new FakeProgress(
          Object.assign({
            timeConstant: 10000,
          }, this.fakeOptions)
        ),
        filesName: [this.fileName],
        files: null,
        startUpload: false,
      };
    },
    computed: {
      progressPercent() {
        return parseInt(this.progress.progress * 100) + '%'
      }
    },
    watch: {
      "progress.progress": {
        handler(val) {
          this.progressSetter(Number(val.toFixed(2)))
        }
      },
      files(val) {
        this.$emit('input', val)
      }
    },
    created() {
      this.getProgressSetter = (setter) => {
        this.progressSetter = setter;
      };
    },

    methods: {
      setProgress(val) {
        this.progressSetter(val)
      },
      handleFileSelect(e) {
        const input = e.target;
        const files = input.files;
        this.files = files;
        const fileNames = [];
        for (const file of files) {
          fileNames.push(file.name)
        }
        if (!this.multiple) {
          this.filesName = fileNames;
        } else {
          this.filesName.push(...fileNames)
        }
      },
      start() {
        this.startUpload = true;
        this.progress.start();
      },
      end() {
        this.progress.end();
      }
    },
  }
</script>
<style lang='css'>
  .gislife-upload-wrapper {
    position: relative;
    color: #063770;
    padding-bottom: 4px;
  }

  .gislife-upload__rawInput {
    /* position: absolute;
              inset: 0; */
    opacity: 0;
  }

  .gislife-upload-fake-wrapper {
    display: flex;
    position: absolute;
    inset: 0;
    padding: 4px 4px 4px 0px;
    justify-content: space-between;
  }

  .gislife-upload-fake-wrapper> :not([style*="display: none"])+ :not([style*="display: none"]) {
    margin-left: 8px;
  }

  .gislife-upload-fake__button {
    /* display: inline-block;
                          		vertical-align: middle; */
    max-height: 40px;
    display: block;
    margin: auto;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: #409eff;
    /* padding-top: 8px; */
    padding-right: 12px;
    /* padding-bottom: 8px; */
    padding-left: 12px;
    border-radius: 4px;
    pointer-events: none;
    color: #fff;
  }

  .gislife-upload-fake__file {
    flex-grow: 1;
    background-color: #fff;
    max-height: 100%;
    overflow: auto;
  }

  .gislife-upload-fake__file-item {
    overflow: hidden;
    white-space: nowrap;
    font-family: sans-serif;
    text-overflow: ellipsis;
    text-align: left;
  }

  .gislife-upload-fake__progress {
    flex-grow: 0;
    /* padding-left: 4px; */
    padding-right: 4px;
    min-width: max-content;
  }
</style>
