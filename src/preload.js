const {contextBridge,ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron',{
  saveFile : (content)=>ipcRenderer.send('save',content),
  saved : (msg)=>ipcRenderer.on('saved',msg),
  saveMenu : (msg)=> ipcRenderer.on('save-clicked',msg),
  saveAsMenu : (msg)=> ipcRenderer.on('save-as-clicked',msg),
  openDialog : (msg)=> ipcRenderer.on('open-clicked',msg),
  openRequest: ()=> ipcRenderer.send('open-request','open-file'),
  openFile : (fileContent)=> ipcRenderer.on('open-file',fileContent),
  newFile : (msg) => ipcRenderer.on('new-clicked',msg),
  toggle : () => ipcRenderer.invoke('color-scheme:toggle'),
  system : () => ipcRenderer.invoke('color-scheme:system'),
})