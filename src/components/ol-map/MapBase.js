// @ts-ignore
import TileLayer from "ol/layer/Tile";
// @ts-ignore
// @ts-ignore
import { WMTS as WMTSSource, XYZ } from "ol/source";
import Raster from "ol/source/Raster.js";
// @ts-ignore
import { Feature, Map, Overlay, View } from 'ol';
// @ts-ignore
// @ts-ignore
import { applyTransform, getTopLeft, getWidth } from 'ol/extent';
// @ts-ignore
import WMTS from 'ol/tilegrid/WMTS';
// @ts-ignore
import { get as getProjection, getTransform } from 'ol/proj';
// @ts-ignore
import { register } from 'ol/proj/proj4';
// @ts-ignore
import proj4 from 'proj4';
// @ts-ignore
import ImageLayer from "ol/layer/Image";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useMapStore } from "@/components/ol-map/MapStore";
import { GeoJSON } from "ol/format";
import { Circle as StyleCircle, Fill, Icon, Stroke, Style } from "ol/style";
import { getVectorContext } from "ol/render";
import { LineString } from "ol/geom";
let map;
const mapStore = useMapStore();
// proj4.defs("EPSG:4490", "GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs +type=crs");
register(proj4);
/**
 * openlayer初始化
 * @param options
 * return 地图对象
 */
export function initMap(options) {
    const _options = {
        center: [121.3, 31.1],
        zoom: 10,
        minZoom: 1,
        maxZoom: 18
    };
    // @ts-ignore
    Object.assign(options, _options);
    const _map = new Map({
        view: new View({
            center: options.center,
            projection: options.projection,
            zoom: options.zoom || 5,
            maxZoom: options.maxZoom,
            minZoom: options.minZoom
        }),
        target: options.target
    });
    _map.on("click", event => {
        const feature = _map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
            return feature;
        });
        if (feature) {
            //如果注册是 _click
            const cb = feature.get('_click');
            if (cb && typeof cb === "function") {
                return cb(event, feature);
            }
            console.log(feature.get('type'));
            // 在此处添加你的点击处理逻辑
        }
    });
    //用于记录上次触发hover的覆盖物
    let _hoverFeature = undefined;
    _map.on("pointermove", event => {
        const feature = _map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
            return feature;
        });
        //如果当前移入的 feature 跟上次记录的 _hoverFeature 相同，不做任何处理。
        if (feature === _hoverFeature)
            return;
        console.log(feature);
        if (feature) {
            const cb = feature.get('_hover');
            //记录当前移入的feature
            _hoverFeature = feature;
            if (cb && typeof cb === "function") {
                return cb(event, feature);
            }
            console.log("pointermove");
            // 在此处添加你的点击处理逻辑
            /**todo
             *
             */
        }
        else {
            //鼠标移出事件
            const cb = _hoverFeature.get('_moveout');
            _hoverFeature = undefined;
            //处理移除事件
            if (cb && typeof cb === "function") {
                return cb(event);
            }
        }
    });
    map = _map;
    return _map;
}
/**
 * 基于 EPSG:4490 坐标系创建天地图图层
 * @param options
 * @param blue
 *
 * 参考 https://blog.csdn.net/weixin_44519342/article/details/124280468
 */
export function createLayer(options, blue = false) {
    // layers projs matrixSets 同天地图文档
    // http://lbs.tianditu.gov.cn/server/MapService.html
    const layers = {
        '全球境界': 'ibo',
        '地形注记': 'cta',
        '地形晕渲': 'ter',
        '影像注记': 'cia',
        '影像底图': 'img',
        '矢量注记': 'cva',
        '矢量底图': 'vec'
    };
    const projs = {
        '经纬度投影': 'EPSG:4490',
        '球面墨卡托投影': 'EPSG:900913'
    };
    const matrixSets = {
        '经纬度投影': 'c',
        '球面墨卡托投影': 'w'
    };
    // @ts-ignore
    let projection = getProjection(projs[options.proj]);
    let projectionExtent = projection.getExtent();
    let origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90];
    let fromLonLat = getTransform('EPSG:4326', projection);
    let width = projectionExtent ? getWidth(projectionExtent) : getWidth(applyTransform([-180.0, -90.0, 180.0, 90.0], fromLonLat));
    let resolutions = [];
    let matrixIds = [];
    for (let z = 1; z < 19; z++) {
        resolutions[z] = width / (256 * Math.pow(2, z));
        matrixIds[z] = z;
    }
    const wmtsTileGrid = new WMTS({
        origin: origin,
        resolutions: resolutions,
        matrixIds: matrixIds
    });
    // wgs84  gcj02 bd09
    // @ts-ignore
    const wmtsSource = new WMTSSource({
        // @ts-ignore
        url: `/ol-tianditu/${layers[options.type]}_${matrixSets[options.proj]}/wmts?tk=${options.key}`,
        // @ts-ignore
        layer: layers[options.type],
        version: '1.0.0',
        // @ts-ignore
        matrixSet: matrixSets[options.proj],
        format: 'tiles',
        // @ts-ignore
        projection: projection,
        requestEncoding: 'KVP',
        style: 'default',
        tileGrid: wmtsTileGrid
    });
    const wmtsLayer = new TileLayer({
        source: wmtsSource
    });
    if (blue) {
        // @ts-ignore
        return new ImageLayer({
            source: new Raster({
                sources: [
                    //传入图层，这里是天地图矢量图或者天地图矢量注记
                    wmtsLayer,
                ],
                //这里设置为image类型，与官方示例不同，优化速度
                operationType: 'image',
                operation: function (pixels, data) {
                    function _u_reverseFunc(pixelsTemp) {
                        //蓝色
                        for (var i = 0; i < pixelsTemp.length; i += 4) {
                            var r = pixelsTemp[i];
                            var g = pixelsTemp[i + 1];
                            var b = pixelsTemp[i + 2];
                            //运用图像学公式，设置灰度值
                            var grey = r * 0.3 + g * 0.59 + b * 0.11;
                            //将rgb的值替换为灰度值
                            pixelsTemp[i] = grey;
                            pixelsTemp[i + 1] = grey;
                            pixelsTemp[i + 2] = grey;
                            //基于灰色，设置为蓝色，这几个数值是我自己试出来的，可以根据需求调整
                            pixelsTemp[i] = 55 - pixelsTemp[i];
                            pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1];
                            pixelsTemp[i + 2] = 305 - pixelsTemp[i + 2];
                        }
                    }
                    _u_reverseFunc(pixels[0].data);
                    return pixels[0];
                },
                //线程数量
                threads: 10
            })
        });
    }
    else {
        return wmtsLayer;
    }
}
/**
 * 生成公司给的xyz图层对象
 * @param url 图层地址,必须要xyz
 */
export function createLayerWithSlife(url) {
    const _tileLayer = new TileLayer({
        source: new XYZ({
            url: url,
            tileLoadFunction(imageTile, src) {
                //获取屏幕四至范围
                console.log(imageTile);
                console.log(src);
                // @ts-ignore
                imageTile.getImage().src = "http://192.168.0.118:9999/shlzz/smap/tile/0/1/1";
            }
        }),
    });
    // An array of numbers representing an extent: [minx, miny, maxx, maxy].
    return _tileLayer;
}
//坐标转换
export function _transform() {
    // EPSG:4490
    const epsg4490 = "+proj=longlat +ellps=GRS80 +no_defs";
    // WGS84
    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
    console.log(proj4(epsg4490, wgs84, [116.4074, 39.9042]));
}
/**
 *
 * @param coordinates 点的坐标
 * @param index 当前点在 _coordinates 中的下标，如果是单个点，则该值默认为0
 * @param _coordinates 所有的点
 * @param featureFn 覆盖物的事件处理，可以是一个function或者其他任意值，如果设置了 _click ,则要求value为function，并且会在点击该覆盖物的时候触发该function
 * @param iconFn 覆盖物的自定义icon事件，用于添加icon
 */
function createFeature(coordinates, index, _coordinates, featureFn, iconFn) {
    const _feature = new Feature({
        geometry: new Point(coordinates)
    });
    if (featureFn) {
        if (typeof featureFn === "string") {
            _feature.set("type", featureFn);
        }
        else {
            featureFn(_feature, index, _coordinates);
        }
    }
    if (iconFn && typeof iconFn === "function") {
        const style = iconFn(coordinates, index, _coordinates);
        _feature.setStyle(iconFn(style));
    }
    return _feature;
}
/**
 *
 * @param coordinates 要添加的point，可以是多个或单个
 * @param featureFn 覆盖物的事件处理，可以是一个function或者其他任意值，如果设置了 _click ,则要求value为function，并且会在点击该覆盖物的时候触发该function
 * @param iconFn 覆盖物的自定义icon事件，用于添加icon
 * @return vectorLayer 返回当前生成的layer
 */
export function createPoint(coordinates, featureFn, iconFn) {
    const vectorSource = new VectorSource({
        features: [],
    });
    if (Array.isArray(coordinates[0])) {
        // @ts-ignore
        vectorSource.addFeatures(coordinates.map((item, index) => {
            const _feature = createFeature(item, index, coordinates, featureFn, iconFn);
            return _feature;
        }));
    }
    else {
        //单点
        const _feature = createFeature(coordinates, 0, coordinates, featureFn, iconFn);
        vectorSource.addFeature(_feature);
    }
    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });
    return vectorLayer;
}
/**
 *
 * @param coordinates 线段geo [[x,y]]
 * @param featureFn 覆盖物的事件处理，可以是一个function或者其他任意值，如果设置了 _click ,则要求value为function，并且会在点击该覆盖物的时候触发该function
 * @return vectorLayer 返回当前生成的layer
 */
export function createLine(coordinates, featureFn) {
    const featureCollection = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates,
                },
            },
        ],
    };
    const feature = new GeoJSON().readFeatures(featureCollection);
    if (featureFn) {
        feature.forEach((_f, index) => featureFn(_f, index));
    }
    const vectorSource = new VectorSource({
        features: feature,
    });
    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 3,
            }),
        }),
    });
    return vectorLayer;
}
function TrackPlaybackBase(coordinates, initIndex = 0) {
    const styles = {
        marker: new Style({
            image: new StyleCircle({
                radius: 10,
                fill: new Fill({
                    color: 'red'
                })
            })
        }),
        route: new Style({
            stroke: new Stroke({
                width: 6,
                color: [237, 212, 0, 0.8],
            }),
        }),
        endMarker: new Style({
            image: new Icon({
                anchor: [9, 31],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: require("./end.png"),
            }),
        }),
        startMarker: new Style({
            image: new Icon({
                anchor: [9, 31],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: require("./start.png"),
            }),
        })
    };
    const _c = coordinates.slice(0, initIndex === 0 ? 1 : initIndex);
    const route = new LineString(coordinates);
    const passRoute = new LineString(_c);
    console.log(_c);
    const passRouteFeature = new Feature({
        type: 'route',
        geometry: passRoute
    });
    const startMarker = new Feature({
        type: 'startMarker',
        geometry: new Point(route.getFirstCoordinate()),
    });
    const endMarker = new Feature({
        type: 'endMarker',
        geometry: new Point(route.getLastCoordinate()),
    });
    const position = startMarker.getGeometry()?.clone();
    const geoMarker = new Feature({
        type: 'marker',
        geometry: position,
    });
    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            features: [passRouteFeature, geoMarker, startMarker, endMarker],
        }),
        style: function (feature) {
            // @ts-ignore
            return styles[feature.get('type')];
        },
    });
    return {
        vectorLayer,
        position,
        geoMarker,
        passRoute,
        route,
        styles
    };
}
//轨迹回放
export function TrackPlayback(coordinates, initIndex = 0, cb, map) {
    if (!cb) {
        throw new Error("没有回调函数！");
    }
    let playIndex = initIndex || 0;
    const { vectorLayer, position, geoMarker, passRoute, route, styles } = TrackPlaybackBase(coordinates, initIndex);
    let distance = playIndex === 0 ? 0 : playIndex / coordinates.length;
    let lastTime;
    let speed = 5;
    function moveFeature(event) {
        const time = event.frameState.time;
        const elapsedTime = time - lastTime;
        distance = (distance + (speed * elapsedTime) / 1e6) % 2;
        if (distance >= 1) {
            vectorLayer.un('postrender', moveFeature);
            distance = 1;
        }
        lastTime = time;
        const currentCoordinate = route.getCoordinateAt(distance > 1 ? 2 - distance : distance);
        position?.setCoordinates(currentCoordinate);
        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(styles.marker);
        //绘制经过的线
        const _coordinates = passRoute.getCoordinates();
        _coordinates.push(currentCoordinate);
        passRoute.setCoordinates(_coordinates);
        // @ts-ignore
        vectorContext.drawGeometry(position);
        // tell OpenLayers to continue the postrender animation
        map.render();
    }
    function startAnimation() {
        lastTime = Date.now();
        vectorLayer.on('postrender', moveFeature);
        // hide geoMarker and trigger map render through change event
        geoMarker.setGeometry(undefined);
    }
    map.addLayer(vectorLayer);
    // @ts-ignore
    return {
        setOptions(_speed) {
            speed = _speed;
        },
        pause() {
            geoMarker.setGeometry(position);
            vectorLayer.un('postrender', moveFeature);
        },
        play() {
            startAnimation();
        },
        dispose() {
            vectorLayer.un('postrender', moveFeature);
            vectorLayer.dispose();
        }
    };
}
/**
 * 单点冒泡
 * @constructor
 */
export function TrackPlaybackSinglePop(coordinates, initIndex = 0, cb, map) {
    //如果起始位置不为0，生成之前的线
    let playIndex = initIndex || 0;
    const { vectorLayer, position, geoMarker, passRoute, route, styles } = TrackPlaybackBase(coordinates, initIndex);
    //处理route
    let distance = 0;
    let lastTime;
    let speed = 50;
    console.log(coordinates);
    function moveFeature(event) {
        const time = event.frameState.time;
        const elapsedTime = time - lastTime;
        distance = (distance + (speed * elapsedTime) / 1e6) % 2;
        lastTime = time;
        const currentCoordinate = route.getCoordinateAt(distance > 1 ? 1 : distance);
        position?.setCoordinates(currentCoordinate);
        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(styles.marker);
        //绘制经过的线
        const _coordinates = passRoute.getCoordinates();
        _coordinates.push(currentCoordinate);
        passRoute.setCoordinates(_coordinates);
        // @ts-ignore
        vectorContext.drawGeometry(position);
        //同步更新地图，因为需要判断执行状态
        map.render();
        //
        if (distance >= 1) {
            //大于等于1，表示该点位的移动结束了，执行移动结束的回调
            //解除监听事件
            vectorLayer.un('postrender', moveFeature);
            if (playIndex < coordinates.length - 2) {
                cb(playIndex, coordinates[playIndex], playIndex);
                playIndex++;
                distance = 0;
                startAnimation();
            }
            else {
                cb(playIndex, coordinates[playIndex], "finish");
                geoMarker.setGeometry(position);
            }
        }
    }
    map.addLayer(vectorLayer);
    function startAnimation() {
        route.setCoordinates([coordinates[playIndex], coordinates[playIndex + 1]]);
        lastTime = Date.now();
        vectorLayer.on('postrender', moveFeature);
        // hide geoMarker and trigger map render through change event
        geoMarker.setGeometry(undefined);
    }
    startAnimation();
}
/**
 * 生成信息弹窗
 */
export function createInfoWindow() {
    //生成弹窗节点
    const baseEl = document.createElement("div");
    baseEl.id = "OLInfoWindow";
    baseEl.classList.add("ol-info-window");
    const OlInfoWindow = new Overlay({
        id: "olInfoWindow",
        element: baseEl,
        autoPan: true,
        offset: [10, 20],
        autoPanAnimation: {
            duration: 250,
        },
    });
    const closeEl = document.createElement("span");
    closeEl.classList.add("close");
    closeEl.innerHTML = "X";
    closeEl.onclick = () => {
        OlInfoWindow.setPosition(undefined);
    };
    const containerEl = document.createElement("div");
    containerEl.classList.add("ol-info-window-container");
    baseEl.append(closeEl, containerEl);
    return {
        InfoWindow: OlInfoWindow,
        ContainerEl: containerEl
    };
}
/**
 * 以下函数中的地图map对象需要自己定义，示例中的map在上面初始化地图的时候赋值
 */
/**
 * 覆盖物对象，内部变量，不允许外部更改，直接能通过 visibleLayer bingOverlay2Map 这两个方法来改变其内部值
 */
const _overlayMap = {};
/**
 *  判断图层是否存在，只判断该对象是否存在于_overlayMap中，至于是否叠加在地图上请使用 overlayInMap 获取
 * @param name 图层名称，唯一值
 */
export function overlayIsRegister(name) {
    return !!(_overlayMap[name] && _overlayMap[name].target);
}
/**
 *  判断图层是否叠加在地图上
 * @param name 图层名称，唯一值
 */
export function overlayInMap(name) {
    return _overlayMap[name] && _overlayMap[name].target && _overlayMap[name].show;
}
/**
 * 传入图层名称，控制图层显隐
 * @param name 图层名称，唯一值
 * @param visible 是否显示
 */
export function visibleLayer(name, visible) {
    if (!_overlayMap[name] || !_overlayMap[name].target) {
        throw new Error("图层对象不存在！");
    }
    if (visible) {
        //添加图层的时候，如果不是多选图层的情况，需要考虑到对后续其他图层的更改
        map.addLayer(_overlayMap[name].target);
        _overlayMap[name].show = true;
    }
    else {
        //移除图层时，因不需要更改其他图层的状态，可以结束该函数执行
        map.removeLayer(_overlayMap[name].target);
        _overlayMap[name].show = false;
        return;
    }
    //获取是否是多选图层
    const multiple = _overlayMap[name].multiple;
    if (multiple)
        return;
    //清除其他覆盖物
    Object.keys(_overlayMap).forEach(key => {
        //当本次循环的key等于name时，或者当前覆盖物不在地图上，或者当前覆盖物为多选覆盖物时，不做处理
        if (key === name ||
            !_overlayMap[key].show ||
            _overlayMap[key].multiple)
            return;
        //移除覆盖物
        map.removeLayer(_overlayMap[key].target);
        //将boolean值设为false
        _overlayMap[key].show = false;
    });
}
/**
 * 通用的图层管理方法，用于管理图层显隐
 * @param name 图层名称，唯一值
 * @param overlay 图层layer对象
 * @param multiple  是否可以覆盖多个图层，值为false的时候为互斥单选；
 * 值为true时，除非手动清除不然不会在添加其他覆盖物的时候清除该标记为true的覆盖物;
 * 默认值为false
 * 调用 bingOverlay2Map("layerName",layer,true) || bingOverlay2Map("layerName1",layer1)
 */
export function bingOverlay2Map(name, overlay, multiple = false) {
    //如果不存在，初始化该对象
    if (!_overlayMap[name]) {
        _overlayMap[name] = {
            multiple
        };
    }
    //如果覆盖物存在，并且已经覆盖在地图上，则删除该图层.
    if (_overlayMap[name] && _overlayMap[name].show) {
        map.removeLayer(_overlayMap[name].target);
        return _overlayMap[name].show = false;
    }
    //赋予默认值或者更改该值为true
    _overlayMap[name].show = true;
    //如果传了 overlay ，则将目标覆盖物的值设为该 overlay
    if (overlay) {
        //如果之前存在覆盖物，处于兼容性考虑，不管该覆盖物是否存在都移除该name对应的覆盖物
        if (_overlayMap[name].target)
            map.removeLayer(_overlayMap[name].target);
        //重新给覆盖物赋值
        _overlayMap[name].target = overlay;
    }
    //调用该方法，叠加图层
    visibleLayer(name, true);
}
//# sourceMappingURL=MapBase.js.map