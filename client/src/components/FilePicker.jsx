import { useSnapshot } from 'valtio'
import { getContrastingColor } from '../config/helpers'
import CustomButton from './CustomButton'
import state from '../store'

  const FilePicker = ({file, setFile, readFile}) => {
  
  const snap = useSnapshot(state)
  
  return (
    <div className='filepicker-container'>
      <div className='flex-1 flex flex-col'>
        <input 
          type="file" 
          id="file_upload"
          accept='image/*'
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <label htmlFor="file_upload" className={`filepicker-label !text-[${getContrastingColor(snap.color)}]`}
        
        >
          Upload File
        </label>

        <p className='mt-2 text-gray-500 text-xs truncate'>
          {file===''? "No file selected": file.name}
        </p>

      </div>

      <div className='mt-4 flex flex-wrap gap-3'>

        <CustomButton
          type="outline"
          title="Logo"
          handleClick={()=> readFile('logo')}
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={()=> readFile('full')}
          customStyles="text-xs"
        />

      </div>
      
    </div>
  )
}

export default FilePicker