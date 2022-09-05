import { FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'

// -- Params
// title=string
// type=[confirm]
// danger=true/false

// -- Events
// onConfirm=func
// onClose=func

export default function adminNavBar(props) {
  const [countDown, setCountDown] = useState(props.timeout === undefined ? 0 : props.timeout)

  useEffect(() => {setTimeout(() => countDown > 0 ? setCountDown(countDown - 1) : null, 1000)}, [countDown])

  return (
    <>
      <div onClick={props.onClose} className="absolute top-0 left-0 w-screen h-screen bg-black opacity-50"></div>
      <div className="bg-white text-neutral-600 rounded absolute top-1/2 left-1/2 transform shadow -translate-x-1/2 -translate-y-1/2 min-w-[256px] min-h-[100px]">
        <div className="border-b px-4 py-2">
          <p className="text-center px-4">{props.title ? props.title : 'Dialog'}</p>
          <button onClick={props.onClose} className="absolute top-0 right-0 hover:bg-neutral-200 rounded-tr p-3">
            <FiX />
          </button>
        </div>

        <div className="p-4 pt-2">
          {
            !props.type ? 
              (<>{props.children}</>) : 
              (<>
                {props.children}
  
                <div className="flex gap-2 mt-4">
                  <button onClick={props.onClose} className={"py-1 px-4 hover:bg-neutral-100 border rounded " + (props.danger ? 'w-full ml-auto' : 'order-last')}>Cancel</button>
                  {
                      countDown > 0 && props.danger ? (
                        <button className="py-1 px-6 cursor-not-allowed bg-neutral-400 rounded text-white">{countDown}</button>
                      ) : (
                        <button onClick={props.onConfirm} className={"py-1 px-4 rounded text-white " + (props.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 ml-auto hover:bg-cyan-600')}>{props.confirm ? props.confirm : 'Confirm'}</button>
                      )
                    }
                </div>
              </>)
          }
        </div>
      </div>
    </>
  )
}
