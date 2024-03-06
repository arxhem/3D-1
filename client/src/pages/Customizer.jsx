import React from 'react'
import {useState , useEffect} from 'react'
import { AnimatePresence} from 'framer-motion'
import { useSnapshot } from 'valtio'
import {motion} from 'framer-motion'
import config from '../config/config'
import state from '../store'
import {download} from '../assets'
import {downloadCanvasToImage , reader} from '../config/helpers'
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AiPicker,ColorPicker,Tab,FilePicker,CustomButton } from '../components'

const Customizer = () => {
  const snap = useSnapshot(state)
  const [file,setFile]=useState('')
  const[prompt,setPrompt]=useState('')
  const [generatingImg, setGeneratingImg] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt:false,
  })

  

  //show tab content
  const genertateTabContent = () => {
    switch(activeEditorTab){
      case 'colorpicker':
        return <ColorPicker />
        case 'filepicker':
          return <FilePicker 
            file={file}
            setFile={setFile}
            readfile={readfile}
          />
          case 'aipicker':
            return <AiPicker 
              prompt={prompt}
              generatingImg={generatingImg}
              handleSubmit={handleSubmit}
              setPrompt={setPrompt}
            />
      default:
        break;
    }
  }
  const handleSubmit= async (type)=>{
    if(!prompt )return alert('Please enter a prompt');

    try{
      //set generating image to true
      setGeneratingImg(true);
      const res = await fetch('http://localhost:8080/api/v1/dalle',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({prompt,})
      })
      const data = await res.json()
      handleDecals(type, `data:image/png;base64,${data.photo}`)

    }catch(error){
      alert('An error occured')
    }finally{
      setGeneratingImg(false);
      setActiveEditorTab('')
    }
  }
     
  const handleDecals = (type,res) => {
    const decalType = DecalTypes[type]
    state[decalType.stateProperty] = res

    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)  
    }

  }
  const handleActiveFilterTab = (tabName) => {
switch(tabName){
  case "logoShirt":
    state.isLogoTexture= !activeFilterTab[tabName];
    break;
    case "stylishShirt":
      state.isFullTexture= !activeFilterTab[tabName];
      break;
      default:
        state.isFullTexture= false;
        state.isLogoTexture= true;
}
setActiveFilterTab((prevState)=>{
  return{
    ...prevState,
    [tabName]:!prevState[tabName]
  }

})
  }



  const readfile=(type)=>{
    reader(file).then((res)=>{
      handleDecals(type,res)  
      setActiveEditorTab('')
    })

  }



  return (
    <AnimatePresence>
    {!snap.intro && (
      <>
      <motion.div
      className='absolute top-0 left-0 z-10'
      key="custom"
      {...slideAnimation('left')}
      >
      <div className='flex items-center min-h-screen'>
      <div className='editortabs-container tabs' >
      {
        EditorTabs.map((tab) => (
          <Tab key={tab.name} tab={tab} 
          handleClick={() =>{setActiveEditorTab(tab.name)}}
          />
          ))
      }
      {genertateTabContent()}
      </div>
      </div>
      </motion.div>

      <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
      <CustomButton
      type="filled"
      title="Go Back"
      handleClick={() => state.intro = true}
      customStyles="w-fit px-4 py-2.5 font-bold text-sm"      
      />
      </motion.div>
      <motion.div className='filtertabs-container'
      {...slideAnimation('up')}
      >
      {
        FilterTabs.map((tab) => (
          <Tab 
          key={tab.name}
           tab={tab} 
           isFilterTab
            isActiveTab= {activeFilterTab[tab.name]}
          handleClick={() =>{handleActiveFilterTab(tab.name)}}
          />
          ))
      }
      <button className="download-btn" onClick={downloadCanvasToImage}>
<img
src={download}
alt="download_image"
className="w-3/5 h-3/5 object-contain"
/>
</button>
      </motion.div>
      </>
    )}
    </AnimatePresence>
  )
}

export default Customizer;
