import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';

import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';

import { fadeAnimation, slideAnimation } from '../config/motion';

import { AiPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
    const snap = useSnapshot(state);

    const [file, setFile] = useState('');

    const [prompt, setPrompt] = useState('')

    const [generatingImg, setGeneratingImg] = useState(false);

    const [activeEditorTab, setActiveEditorTab] = useState("");

    const [activeFilterTab, setActiveFilterTab] = useState(
      {
        logoShirt: true,
        stylishShirt: false
      }
    );

    const [generated, setgenerated] = useState(false);

    //show tab content depending on the active Tab

    const generateTabContent = ()=>{
      switch (activeEditorTab) {
        case "colorpicker":
          return <ColorPicker/>
        
        case "filepicker":
          return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                  />
        case "aipicker":
          return <AiPicker
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                    generated={generated}
                  />
        default:
          return null;
          
      }
    }

    const handleSubmit = async (type)=>{
      if(!prompt) return alert("Please enter a prompt");

      try {
        //call our backend to generate an ai image!
        setGeneratingImg(true);

        const response = await fetch('https://threed-thirt-design.onrender.com/api/v1/gemini',
          {
            method:'POST',
            headers:{
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({
              prompt,
            })
          }
        )

        const data = await response.json();
        setgenerated(true);
        handleDecals(type, `${data.photo}`)

      } catch (error) {
        alert(error)
        setgenerated(false);
      }finally{
        setGeneratingImg(false);
        setActiveEditorTab("");
      }

    }

    const handleActiveFilterTab = (tabName)=>{
      switch (tabName) {
        case 'logoShirt':
          state.isLogoTexture = !activeFilterTab[tabName]
          break;
        case 'stylishShirt':
          state.isFullTexture = !activeFilterTab[tabName]
          break;
      
        default:
          state.isLogoTexture = true;
          state.isFullTexture = false;
          break;
      }

      //after setting the state, activeFilterTab is updated

      setActiveFilterTab((prevState)=>{
        return {
          ...prevState,
          [tabName]:!prevState[tabName]
        }
      })
    }

    const handleDecals = (type, result) =>{
      const decalType  = DecalTypes[type];

      state[decalType.stateProperty] = result;

      if(!activeFilterTab[decalType.filterTab]){
        handleActiveFilterTab(decalType.filterTab)
      }
    }

    const readFile = (type) => {
      reader(file)
        .then((result)=> {
          handleDecals(type, result);
          setActiveEditorTab("");
        })
    }
    
  return (
    <AnimatePresence>
        {
            !snap.intro && (
                <>
                   <motion.div
                    key='custom'
                    className='absolute top-0 left-0 z-10'
                    {...slideAnimation('left')}
                   
                   >
                    <div
                      className='flex items-center min-h-screen'
                    >
                      <div className='editortabs-container tabs'>
                        {EditorTabs.map((tab)=>(
                          <Tab 
                            key={tab.name}
                            tab={tab}
                            handleClick = {()=> setActiveEditorTab(tab.name)}
                          />
                        ))}
                        {generateTabContent()}
                      </div>

                    </div>

                   </motion.div>

                   <motion.div
                    className='absolute z-10 top-5 right-5'
                    {...fadeAnimation}
                   >
                    <CustomButton
                      type="filled"
                      title="Go Back"
                      handleClick={()=> state.intro = true}
                      customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                    />

                   </motion.div>

                   <motion.div
                    className="filtertabs-container"
                    {...slideAnimation('up')}
                   >
                    {FilterTabs.map((tab)=>(
                          <Tab 
                            key={tab.name}
                            tab={tab}
                            isFilterTab
                            isActiveTab={activeFilterTab[tab.name]}
                            handleClick = {()=> handleActiveFilterTab(tab.name)}
                          />
                    ))}

                   </motion.div>
                </>
            )
        }
    </AnimatePresence>
  )
}

export default Customizer