<template>
    <div class="map " id="map">

    </div>
    <teleport to="body">
        <div style="position: absolute;right: 0;top:100px;background: #fff">
            {{ mapStore.count }}

            <div>
                <button @click="toAddLayer('singleVectorLayer',true)">叠加单选覆盖物1（单点，蓝色 start icon）</button>
            </div>
            <div>
                <button @click="toAddLayer('singleVectorLayer')">隐藏单选覆盖物1（单点，蓝色 start icon）</button>
            </div>
            <div>
                <button @click="toAddLayer('multipleVectorLayer',true)">叠加单选覆盖物2（多个点，红色 end icon）</button>
            </div>
            <div>
                <button @click="toAddLayer('multipleVectorLayer')">隐藏单选覆盖物2（单点，红色 end icon）</button>
            </div>
            <div>
                <button @click="toAddMultipleLayer('baseMarkerLayer',true)">叠加多选覆盖物1(标注图层)</button>
            </div>
            <div>
                <button @click="toAddMultipleLayer('baseMarkerLayer')">隐藏多选覆盖物1(标注图层)</button>
            </div>
            <div>
                <button @click="toAddMultipleLayer('lineVectorLayer',true)">叠加多选覆盖物2（线）</button>
            </div>
            <div>
                <button @click="toAddMultipleLayer('lineVectorLayer')">隐藏多选覆盖物2（线）</button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import {onMounted, watch} from "vue";
import {
    bingOverlay2Map,
    createInfoWindow,
    createLayer,
    createLine,
    createPoint,
    initMap,
    overlayInMap,
    overlayIsRegister,
    visibleLayer
} from "./MapBase.ts";
//引入point
import {Icon, Stroke, Style, Text, Circle, Fill} from "ol/style";
import {useMapStore} from "@/components/ol-map/MapStore";

const mapStore = useMapStore()
let layerObject = {}
onMounted(() => {
    const multiplePoint = [
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()], [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()], [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()], [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()], [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],
        [121 + Math.random(), 31 + +Math.random()],

    ]

    const map = initMap({
        target: "map",
        center: [121.3, 31.1],
        projection: "EPSG:4490",
        minZoom: 5,
    })
    const baseLayer = createLayer({
        type: '矢量底图',
        proj: '球面墨卡托投影',
        key: '5cbc6d295f86d6185b3f30dc3a4374d3'
    }, true)
    const baseMarkerLayer = createLayer({
        type: '矢量注记',
        proj: '球面墨卡托投影',
        key: '5cbc6d295f86d6185b3f30dc3a4374d3'
    })
    map.addLayer(baseLayer)


    // 叠加公司的图层
    // const xyzTileLayer = createLayerWithSlife('http://180.167.126.177:8090/MapLayers/PDLY/PDJC_LD20220915/{z}/{y}/{x}')

    // const xyzTileLayer = createLayerWithSlife('http://192.168.0.118:9999/shlzz/smap/tile/{z}/{x}/{y}')
    // map.addLayer(xyzTileLayer)
    //生成信息弹窗
    const {InfoWindow, ContainerEl} = createInfoWindow();
    map.addOverlay(InfoWindow)
    const iconStyle = new Style({
        image: new Icon({
            anchor: [9, 31],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: require("./start.png"),
        }),
    });
    const endIconStyle = new Style({
        image: new Icon({
            anchor: [9, 31],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: require("./end.png"),
        }),
    });
    const singleVectorLayer = createPoint([121.31, 31.32], "single-point", () => iconStyle)
    const multipleVectorLayer = createPoint(multiplePoint,
        (feature, index) => {
            //设置要设置的值
            feature.set("index", index)
            feature.set("icon_bool", true)

            feature.set("_click", (event, _feature) => {
                console.log(_feature)
                const _iconBool = feature.get("icon_bool")
                _feature.set("icon_bool", !_iconBool)
                _feature.setStyle(_iconBool ? iconStyle : endIconStyle)
                ContainerEl.innerHTML = `<div>
<div>
<h1>当前_click第${_feature.get("index")}个</h1>
</div>
</div>`
                InfoWindow.setPosition(event.coordinate)
            })
            feature.set("_hover", (event, _feature) => {
                // pixel_
                ContainerEl.innerHTML = `<div><div><h1>当前_hover第${_feature.get("index")}个</h1></div></div>`
                console.log(event.coordinate)
                console.log(event.pixel_)
                const [x, y] = event.pixel_
                //
                // InfoWindow.set
                InfoWindow.setPosition(event.coordinate)
            })
            feature.set("_moveout", (event, _feature) => {
                InfoWindow.setPosition(undefined)
            })
        },
        (thisCoordinates, index, coordinates) => endIconStyle)
    const singleVectorLayerIcon = createPoint([121.31, 31.22], (feature, index) => {
        feature.set("type", `singleVectorLayerIcon-${index}`)
    }, () => {
        return iconStyle
    })

    /*map.addLayer(singleVectorLayer)
    map.addLayer(multipleVectorLayer)
    map.addLayer(singleVectorLayerIcon)*/

    // 画线
    const lineVectorLayer = createLine(multiplePoint, (feature, index) => {
        feature.set("_click", (_feature) => {
            alert("AAAAAAAAAAAAAAAAAAAA")
        })
    })

    lineVectorLayer.setStyle(new Style({
        stroke: new Stroke({
            color: 'red',
            width: 3,
        }),
    }))


    // bingOverlay2Map('singleVectorLayer', singleVectorLayer)
    // bingOverlay2Map('multipleVectorLayer', multipleVectorLayer)
    layerObject = {
        singleVectorLayer,
        multipleVectorLayer,
        baseMarkerLayer,
        lineVectorLayer
    }

    // map.addLayer(lineVectorLayer)
    //轨迹回放
    /*   const trackFns = TrackPlayback(multiplePoint, 10, () => {
           return true
       }, map)
       trackFns.play()
   */
    //轨迹回放-单点冒泡
    /*TrackPlaybackSinglePop(multiplePoint, 1, (_idx, _c, status) => {
        console.log(_idx, _c, status)
    }, map)*/


    //创建canvas对象，返回一个图片地址
    function createCanvasImage(
        canvasConfig = {
            width: 40,
            height: 40,
            lineWidth: 2,
            font: "20px Arial",
            text: 5
        }) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvasConfig.width;
        canvas.height = canvasConfig.height;
        const center = {
            x: canvasConfig.width / 2,
            y: canvasConfig.height / 2
        }
        // 绘制圆
        ctx.beginPath();
        ctx.arc(center.x,
            center.y,
            ((canvasConfig.width - 4) / 2 - (canvasConfig.lineWidth || 1) - 1), 0, 2 * Math.PI);
        ctx.closePath();

        // 填充圆
        ctx.fillStyle = canvasConfig.circleFillStyle || 'blue';
        ;
        ctx.fill();

        // 绘制白色描边
        ctx.lineWidth = canvasConfig.lineWidth || 1;
        ctx.strokeStyle = canvasConfig.strokeStyle || 'red';
        ctx.stroke();
        // 在圆心处绘制数字
        ctx.font = canvasConfig.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = canvasConfig.fontFillStyle || 'white';
        console.log(canvasConfig.text)

        ctx.fillText(canvasConfig.text || 5, center.x, center.y);
        const dataUrl = canvas.toDataURL();
        canvas.remove()
        return dataUrl
    }


    //定义每个级别要显示的层级范围
    const layerZoomRange = {
        municipal: {
            min: 0,
            max: 10
        },
        town: {
            min: 10,
            max: 12
        },
        detailPoints: {
            min: 12,
            max: 20
        },
    }

    //生成三个数据图层  市级所有点 区县所有点 各区县point
    // 市级点位数字总和
    const municipal = createPoint([121.31, 31.22], (feature, index) => {
        feature.set("type", `singleVectorLayerIcon-${index}`)
    }, () => {

        const canvasConfig = {
            width: 40,
            height: 40,
            lineWidth: 2,
            font: "20px Arial",
            text: (Math.random() * 100).toFixed(0),
            circleFillStyle: "#fff",
            strokeStyle: "red",
            fontFillStyle: "yellow"
        }
        return new Style({
            image: new Icon({
                anchor: [canvasConfig.width / 2, canvasConfig.height / 2],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                //通过canvas绘制该图形
                src: createCanvasImage(canvasConfig),
            }),
            /*text: new Text({
                font: '24px sans-serif',
                text: (Math.random() * 100).toFixed(0),
                //字体颜色
                fill: new Fill({color: 'red'}),
                offsetY: 2
            })*/
        });
    })
    municipal.setMinZoom(layerZoomRange.municipal.min)
    municipal.setMaxZoom(layerZoomRange.municipal.max)
    // 区县点位数字总和
    const town = createPoint([[121.32, 31.22], [121.33, 31.22], [121.30, 31.22]], (feature, index) => {
        feature.set("type", `singleVectorLayerIcon-${index}`)
    }, () => {
        const canvasConfig = {
            //圆的大小
            width: 32,
            height: 32,
            //圆的描边宽度
            lineWidth: 2,
            //字体大小跟字体
            font: "18px Arial",
            //填充的字体内容
            text: (Math.random() * 100).toFixed(0),
            //圆的填充色
            circleFillStyle: "#fff",
            //圆的描边色
            strokeStyle: "red",
            //字体颜色
            fontFillStyle: "black"
        }
        /*return new Style({
            image: new Icon({
                anchor: [canvasConfig.width / 2, canvasConfig.height / 2],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                //通过canvas绘制该图形
                src: createCanvasImage(canvasConfig),
            })
        });*/
        return new Style({
            image: new Circle({
                fill:new Fill({color: 'red'}),
                stroke: new Stroke({color: '#fff', width: 2}),
                radius:20,
            }),
            text: new Text({
                font: '24px sans-serif',
                text: (Math.random() * 100).toFixed(0),
                fill: new Fill({color: 'fff'})
            })
        });
    })
    town.setMinZoom(layerZoomRange.town.min)
    town.setMaxZoom(layerZoomRange.town.max)
    // 各区县point撒点
    const detailPoints = createPoint(multiplePoint, (feature, index) => {
        feature.set("type", `singleVectorLayerIcon-${index}`)
    }, () => {
        return iconStyle
    })
    detailPoints.setMinZoom(layerZoomRange.detailPoints.min)
    detailPoints.setMaxZoom(layerZoomRange.detailPoints.max)
    map.addLayer(municipal)
    map.addLayer(town)
    map.addLayer(detailPoints)
})

function toAddLayer(name, visible) {
    //判断是否存在
    if (overlayIsRegister(name)) {
        const isInMap = overlayInMap(name)
        console.log(isInMap)
        //如果 visible=true 并且 isInMap 为true 或者 visible为false 并且 isInMap为false
        if ((visible && isInMap) || (!visible && !isInMap)) return;
        visibleLayer(name, visible)
    } else {
        bingOverlay2Map(name, layerObject[name])
    }
}

function toAddMultipleLayer(name, visible) {
    //判断是否存在
    if (overlayIsRegister(name)) {
        const isInMap = overlayInMap(name)
        //如果 visible=true 并且 isInMap 为true 或者 visible为false 并且 isInMap为false

        if ((visible && isInMap) || (!visible && !overlayInMap(name))) return;
        visibleLayer(name, visible)
    } else {
        bingOverlay2Map(name, layerObject[name], true)
    }
}

watch(() => mapStore.count, () => {
    console.log(mapStore.count)
})

</script>

<style scoped lang="less">
.map {
    height: 100%;
    width: 100%;
}
</style>
<style lang="less">
.ol-info-window {
    background: white;
    position: relative;
    padding: 12px;
    box-sizing: border-box;

    .close {
        position: absolute;
        right: 4px;
        top: 4px;
        z-index: 1;
    }

    .ol-info-window-container {
        z-index: 0;
    }
}
</style>
