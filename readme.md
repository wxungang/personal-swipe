## swipe


## how to use
~~~html
  <div class="swipe personal-swipe" v-personal-swipe:tap.stop.prevent="phandle">
        <p v-personal-swipe:tap.stop.prevent="tapHandle">tapHandle</p>
        <p v-personal-swipe:singleTap.stop.prevent="singleTap">singleTap</p>
        <p v-personal-swipe:doubleTap.stop.prevent="doubleTap">doubleTap</p>
        <p v-personal-swipe:longTap.stop.prevent="longTap">longTap</p>
        <p v-personal-swipe:swipe.stop.prevent="swipeHandle">swipe</p>
        <p v-personal-swipe:swipeRight.stop.prevent="swipeRight">swipeRight</p>
        <p v-personal-swipe:swipeLeft.stop.prevent="swipeLeft">swipeLeft</p>
  </div>
~~~

## 更新
- 新增stop功能
