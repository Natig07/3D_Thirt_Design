import { useSnapshot } from 'valtio';
import { getContrastingColor } from '../config/helpers';
import CustomButton from './CustomButton';
import state from '../store';


const AiPicker = ({ prompt, setPrompt, generatingImg, handleSubmit,generated }) => {

    const snap = useSnapshot(state);

  return (
    <div className='aipicker-container'>
      <textarea 
        id="text_area_prompt"
        placeholder='Ask AI...'
        className={`aipicker-textarea rounded-md resize-none !text-[${getContrastingColor(snap.color)}]`}
        rows={5}
        value={generated? null : prompt}
        onChange={(e)=>setPrompt(e.target.value)}

        />
          <div className='flex flex-wrap gap-3'>
            {generatingImg? (
              <CustomButton
                type='outline'
                title="AI is generating.."
                customStyles="text-xs"
              />
            ):(
              <>
                <CustomButton
                  type="outline"
                  title="AI Logo"
                  handleClick={()=>handleSubmit('logo')}
                  customStyles='text-xs'
                />

                <CustomButton
                  type="filled"
                  title="AI Full"
                  handleClick={()=>handleSubmit('full')}
                  customStyles='text-xs'
                />
              </>
            )
          }
          </div>
        
    </div>
  )
}

export default AiPicker