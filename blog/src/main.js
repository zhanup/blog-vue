import Vue from 'vue';
import App from './App.vue';
import router from './router';
import hljs from 'highlight.js';
import { Input, Button, Pagination, Table,
   TableColumn, Dialog, Menu, MenuItem, 
   Dropdown, DropdownMenu, DropdownItem, Popover, 
   Carousel, CarouselItem, Message, Badge, Tag,
   Image, Backtop, Drawer, Icon, Popconfirm  } from 'element-ui';

import 'highlight.js/styles/agate.css';

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Image);
Vue.use(Backtop);
Vue.use(Drawer);
Vue.use(Icon);
Vue.use(Badge);
Vue.use(Popconfirm);

Vue.component(Message.name, Message)
Vue.prototype.$message = Message

// 自定义指令
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')