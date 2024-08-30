const {app,BrowserWindow,ipcMain,dialog,Menu,nativeTheme,shell} = require('electron')
const { autoUpdater } = require("electron-updater")
const path = require('node:path')
const fs = require('node:fs')




let mainWindow
let filepath = undefined
// const cssProps = {}

// function to create main window
function createMainWindow(){
  mainWindow = new BrowserWindow({
    webPreferences :{
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('src/index.html')

  // mainWindow.once('ready-to-show',function(){
  //   autoUpdater.checkForUpdatesAndNotify()
  // })
}

// shell.openExternal('https://github.com')

// create main window when
app.on('ready',function () {
  // shell.beep()
  // console.log(app.isReady());
  createMainWindow()
  // const  {net} = require('electron')
  // const request = net.request('https://github.com')
  // request.on('response', (response) => {
  //   console.log(`STATUS: ${response.statusCode}`)
  //   console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
  //   response.on('data', (chunk) => {
  //     // console.log(`BODY: ${chunk}`)
  //   })
  //   response.on('end', () => {
  //     console.log('No more data in response.')
  //   })
  // })
  // request.end()
  
})

// recieve 'save' message as well as comtent to save in a file 
ipcMain.on('save',(event,content)=>{
  // console.log(cssProps);
  const {text , cssContent} = content
  let textContent = text

  // console.log(cssContent);

  // Save the text to a file
  if(filepath === undefined){
      // display save dialog box synchronously 
      filepath =  dialog.showSaveDialogSync(mainWindow,{
        title : "Save File",
        defaultPath : path.join(__dirname,'Text-File'),
        filters :[
          {
            name : "txt",
            extensions :['txt']
          }
        ]
      })
    if (filepath) {
      const filename = path.basename(filepath,path.extname(filepath))
      // console.log(filename);
      // cssProps[filename] = cssContent
      // console.log(cssProps);
      writeToFile(textContent)
    }
  }
  else{
    const filename = path.basename(filepath,path.extname(filepath))
    // console.log(filename);
    // cssProps[filename] = cssContent
    // console.log(cssProps);
    writeToFile(textContent)
  }

  // console.log(cssProps);
})

// function to write file 
function writeToFile(data){
  fs.writeFileSync(filepath, data,(err)=>{
    if(err){
      const response = dialog.showMessageBox(mainWindow,{
        type : 'info',
        title: 'Saving Status',
        message : 'file not saved at :' + filepath,
        buttons : ['OK'] 
      })
    
    };
  });
  // console.log(filepath);

  // const response = dialog.showMessageBox(mainWindow,{
  //   type : 'info',
  //   title: 'Saving Status',
  //   message : 'file saved at :' + filepath,
  //   buttons : ['OK'] 
  // })

  // send 'saved' message as wel as filepath to renderer process when file is save successfully 
  mainWindow.webContents.send('saved','success',filepath)
}


ipcMain.on('open-request',(event,msg)=>{
  // console.log(msg);
  // showOpenDialogSync return ['filepath'] || undefined when dialog box is canceled
  const openfilePath = dialog.showOpenDialogSync(mainWindow,{
    title : 'Open File',
    defaultPath : path.join(__dirname,'Text-File'),
    filters :[
      {
        name : "txt",
        extensions :['txt']
      }
    ],
    properties:['openFile']
  })
  if(openfilePath){
    // console.log(typeof(openfilePath)); // is object type 
    // console.log(cssProps);
    fileContent = fs.readFileSync(openfilePath[0],'utf-8')
    mainWindow.webContents.send('open-file',fileContent)
  }
})

// help to create menu template 
const menuTemplates = [
  {
    label : 'File',
    submenu : [
      {
        label : 'New',
        accelerator : 'Ctrl+N',
        click(){
          filepath = undefined
          mainWindow.webContents.send('new-clicked','start new file')
        }
      },
      {
        label : 'Open',
        accelerator: 'Ctrl+O',
        click(){
          filepath = undefined;
          mainWindow.webContents.send('open-clicked','open-dialog')
        }
      },
      { type: 'separator'},
      {
        label : 'Save', 
        accelerator: 'Ctrl+S',
        click(){
          console.log('File is saved');
          mainWindow.webContents.send('save-clicked','save')
        }
      },
      {
        label : 'Save As...', 
        accelerator: 'Ctrl+ Shift + S',
        click(){
          filepath = undefined;
          mainWindow.webContents.send('save-as-clicked','save-as')
        }
      },
      {type : 'separator',},
      {role : 'close'}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  
]

const menu = Menu.buildFromTemplate(menuTemplates)
Menu.setApplicationMenu(menu)

// handle application theme dark or light
ipcMain.handle('color-scheme:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

// set application theme to system
ipcMain.handle('color-scheme:system', ()=>{
  nativeTheme.themeSource = 'system'
})