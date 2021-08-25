import Home from '@/module/home/page/home.vue';
import page_list from '@/module/cms/page/page_list.vue';
import page_add from '@/module/cms/page/page_add.vue';
import page_edit from '@/module/cms/page/page_edit.vue';

export default [{
    path: '/',
    component: Home,
    name: 'CMS',//菜单名称
    hidden: false,
    children:[
      {path:'/cms/page/list',name:'订单列表',component: page_list,hidden:false},
      {path:'/cms/page/add',name:'新增订单',component: page_add,hidden:true},
      {path:'/cms/page/edit',name:'订单出库',component: page_edit,hidden:true},
    ]
  }
]
