<script>
  export default {
    name: 'Auth',
    props: {
      funCode: {
        type: String,
        required: true
      }
    },
    computed: {
      isAuthed() {
        const connector = this.$connector;
        const authState = this.$store.state.auth;
        return (funCode) => connector?.isMain()
          ? authState.funCode.find(code => code == funCode)
          : authState.mainBtnAuthed.find(btn => btn.funCode == funCode)
      },
      buttonInfo() {
        const connector = this.$connector;
        const authState = this.$store.state.auth;
        return (funCode) => connector?.isMain()
          ? authState.btnInfo.find(btn => btn.funCode == funCode)
          : authState.mainBtnAuthed.find(btn => btn.funCode == funCode)
      }
    },
    render() {
      return this.isAuthed(this.funCode) ? this.$slots.default : null;
    }
  }
</script>
