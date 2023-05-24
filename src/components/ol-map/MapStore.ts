import {defineStore} from "pinia";
import {ref} from "vue";


export const useMapStore = defineStore('MapStore', () => {
    const count = ref(0)

    return { count}
})
