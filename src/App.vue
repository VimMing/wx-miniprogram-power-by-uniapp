<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
    const updateManager = uni.getUpdateManager();

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
    });

    updateManager.onUpdateReady(function() {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "static/scss/iconfont.scss";
.pull-right {
  float: right;
}
view {
  color: #808080;
  font-size: 16px;
}
uni-button[type="primary"][plain] {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  background-color: rgba(0, 0, 0, 0);
}
button[plain] {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  background-color: rgba(0, 0, 0, 0);
}
</style>
