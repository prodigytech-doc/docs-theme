import './styles/fonts.css'
import './styles/vars.css'
import './styles/base.css'
import './styles/utils.css'
import './styles/components/custom-block.css'
import './styles/components/vp-code.css'
import './styles/components/vp-code-group.css'
import './styles/components/vp-doc.css'
import './styles/components/vp-sponsor.css'

import { Theme, useRoute } from 'vitepress'
import VPBadge from './components/VPBadge.vue'
import VPScore from './components/VPScore.vue'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import { onMounted, watch } from 'vue'
import ViewerJs from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'
import { pandora, usePandoraParams } from './composables/pandora-view'

export { default as VPHomeHero } from './components/VPHomeHero.vue'
export { default as VPHomeFeatures } from './components/VPHomeFeatures.vue'
export { default as VPHomeSponsors } from './components/VPHomeSponsors.vue'
export { default as VPDocAsideSponsors } from './components/VPDocAsideSponsors.vue'
export { default as VPTeamPage } from './components/VPTeamPage.vue'
export { default as VPTeamPageTitle } from './components/VPTeamPageTitle.vue'
export { default as VPTeamPageSection } from './components/VPTeamPageSection.vue'
export { default as VPTeamMembers } from './components/VPTeamMembers.vue'

const theme: Theme = {
  Layout,
  NotFound,
  enhanceApp: ({ app }) => {
    app.component('Badge', VPBadge)
    app.component('Score', VPScore)
  },
  setup() {
    const route = useRoute()
    const { name, type } = usePandoraParams()
    let view: ViewerJs | undefined
    let Anchors: NodeListOf<HTMLAnchorElement>

    function findA(el: HTMLElement): string {
      if (el.tagName === 'A') {
        return (el as HTMLAnchorElement).href
      } else {
        if (el.parentElement) {
          return findA(el.parentElement)
        } else {
          return ''
        }
      }
    }
    function linkClick(e: Event) {
      const el = e.target as HTMLElement
      const a_name = el.innerText
      const a_url = findA(el)
      pandora.send('doc_tap_doc', {
        name,
        type,
        a_name,
        a_url,
        page_hash: decodeURIComponent(location.href.replace('#', ''))
      })
    }
    watch(route, () => {
      view?.destroy()
      Anchors.forEach((a) => {
        a.removeEventListener('click', linkClick)
      })
      setTimeout(() => {
        view = new ViewerJs(document.querySelector('.main')!)
        Anchors = document.querySelectorAll<HTMLAnchorElement>('.content a')
        Anchors.forEach((a) => {
          a.addEventListener('click', linkClick)
        })
      })
    })

    onMounted(() => {
      view = new ViewerJs(document.querySelector('.main')!)
      Anchors = document.querySelectorAll<HTMLAnchorElement>('.content a')
      Anchors.forEach((a) => {
        a.addEventListener('click', linkClick)
      })
    })
  }
}

export default theme
