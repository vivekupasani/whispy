import Store from 'electron-store'

interface StoreSchema {
  groqApiKey: string
  openaiApiKey: string
  hotkey: string
}

export const store = new Store<StoreSchema>({
  defaults: {
    groqApiKey: '',
    openaiApiKey: '',
    hotkey: 'rightOption'
  }
})
