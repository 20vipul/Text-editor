const incFontBtn = document.getElementById("increaseFont")
const descFontBtn = document.getElementById("decreaseFont")
const saveBtn = document.getElementById("save")
const textArea = document.getElementById("textarea")
const darkBtn = document.getElementById("dark_theme")
const lightBtn = document.getElementById("light_theme")
const systemBtn = document.getElementById("system_theme")
let fontSize = 14

lightBtn.style.display = "none" //hide light theme btn

//set dark theme
darkBtn.addEventListener('click',function(){
  window.electron.toggle()
  .then(
    function(){
      darkBtn.style.display = 'none'
      lightBtn.style.display = ''
    }
  )
})

//set light them
lightBtn.addEventListener('click',function(){
  window.electron.toggle()
  .then(
    function(){
      lightBtn.style.display = 'none'
      darkBtn.style.display = ''
    }
  )
})

//set system theme
systemBtn.addEventListener('click',function(){
  window.electron.system()
})

//Increase font size
incFontBtn.addEventListener('click',(event)=>{
  fontSize +=1
  textArea.style.fontSize = fontSize + 'px'
})

//Decrease font Size
descFontBtn.addEventListener('click',(event)=>{
  fontSize -=1
  textArea.style.fontSize = fontSize +'px'
})

//make save btn functional
saveBtn.addEventListener('click',(event)=>{
  content = {}
  let text = textArea.value
  content.text = text
  let computedStyles = window.getComputedStyle(textArea);
  content.cssContent = {}
  for (let property in computedStyles) {
    const propertyValue = computedStyles.getPropertyValue(property);
    if (propertyValue.trim().length !== 0) {
      if (typeof propertyValue === "string") {
        // cssContent += `"${property}": "${propertyValue}",\n`;
        content.cssContent[property] = propertyValue
      } else {
        // cssContent += `"${property}": ${propertyValue},\n`;
        content.cssContent[property] = propertyValue
      }
    }
  }
  console.log(content); // Log the CSS content to console
  window.electron.saveFile(content)
})


//getting success or failure msg when file is saved
window.electron.saved((event,msg,filepath)=>{
  if(msg === 'success'){
    console.log(`file saved successfully \n ${filepath}`);
    textArea.style.backgroundColor = "#b2ff99"
  }
  else{
    console.log('file not saved');
    textArea.style.backgroundColor = "#ff8989"
  }
  setTimeout(()=>textArea.style.backgroundColor = "", 1000)
})

// save file using file menu save option
window.electron.saveMenu(()=>{
  let  text = textArea.value
  let computedStyles = window.getComputedStyle(textArea);
  let cssContent = "";
  for (let property in computedStyles) {
    const propertyValue = computedStyles.getPropertyValue(property);
    if (propertyValue.trim().length !== 0) {
      if (typeof propertyValue === "string") {
        cssContent += `"${property}": "${propertyValue}";\n`;
      } else {
        cssContent += `"${property}": ${propertyValue};\n`;
      }
    }
  }
  console.log(cssContent); // Log the CSS content to console
  window.electron.saveFile({text,cssContent})
})

// save file using file menu save-as option
window.electron.saveAsMenu(()=>{
  let text = textArea.value
  let computedStyles = window.getComputedStyle(textArea);
  let cssContent = "";
  for (let property in computedStyles) {
    const propertyValue = computedStyles.getPropertyValue(property);
    if (propertyValue.trim().length !== 0) {
      if (typeof propertyValue === "string") {
        cssContent += `"${property}": "${propertyValue}";\n`;
      } else {
        cssContent += `"${property}": ${propertyValue};\n`;
      }
    }
  }
  console.log(cssContent); // Log the CSS content to console
  window.electron.saveFile({text,cssContent})
})

// open OpenDialog box using file  menu open option
window.electron.openDialog((event,msg)=>{
  // console.log(msg);
  window.electron.openRequest()
 
})

// displaying selected file content in text area
window.electron.openFile((event,fileContent)=>{
  console.log(typeof(fileContent));
 textArea.value = fileContent
})

// start new file when New is clicked in file menu 
window.electron.newFile((event,msg)=>{
  textArea.value = ''
  console.log(msg);
})


