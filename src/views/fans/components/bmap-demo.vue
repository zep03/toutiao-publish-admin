<template>
  <!--  1. 创建地图容器元素-->
  <div class="bmap" id="container"></div>
</template>

<script>
export default {
  name: 'BmapDemo',
  mounted () {
    // 2. 创建地图示例
    var map = new window.BMapGL.Map('container')
    // 3. 设置中心点坐标
    var point = new window.BMapGL.Point(116.404, 39.915)
    // 4. 地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 15)
    // 5. 开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true)
    var scaleCtrl = new window.BMapGL.ScaleControl() // 添加比例尺控件
    map.addControl(scaleCtrl)
    var zoomCtrl = new window.BMapGL.ZoomControl() // 添加缩放控件
    map.addControl(zoomCtrl)
    var cityCtrl = new window.BMapGL.CityListControl() // 添加城市列表控件
    map.addControl(cityCtrl)
  }
}
</script>

<style scoped>
.bmap {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}
</style>
