<template>
  <div class="yloading">
    <van-overlay :show="true" >
      <div class="wrapper">
        <div class="block">
           <van-loading />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.block, .wrapper {
    width: 100%;
    height: 100%;
}
.block {
    display: grid;
    place-items: center;
}
.yloading {
  z-index: 9999;
  position: fixed;
}
</style>