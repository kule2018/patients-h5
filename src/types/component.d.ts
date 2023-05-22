import CpIcon from '@/components/CpIcon.vue'
import CpNavBar from '@/components/CpNavBar.vue'
import CpRadioBtnVue from '@/components/CpRadioBtn.vue'
// TODO 给 cp-nav-bar 组件添加类型
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtnVue: typeof CpRadioBtnVue
  }
}
