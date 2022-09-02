import { FiUsers, FiMenu, FiLogOut, FiActivity } from 'react-icons/fi'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

import Modal from '/source/components/modal.jsx'

export default function adminNavBar() {
  const [showModal, setShowModal] = useState()
  const {data: session} = useSession()
  
  return (
    <div className="bg-white">
      <div className="border-b">
        <div className="container mx-auto flex">
          <div className="p-4 flex">
            <p className="text-2xl">Next CMS</p>
            <p className="text-sm mx-2">1.0.0</p>
          </div>

          <button className="ml-auto px-4 text-right hover:bg-neutral-100 flex gap-4" onClick={() => setShowModal(true)}>
            <div className="my-3">
              <p className="text-sm">{session?.user.name}</p>
              <p className="text-sm italic text-neutral-500">{
                session?.user.permission == 0 ? 'Unprivileged' :  
                session?.user.permission == 1 ? 'Viewer' : 
                session?.user.permission == 2 ? 'Moderator' :  
                session?.user.permission == 4 ? 'Administrator' : null
              }</p>
            </div>
            <FiMenu className="my-5 text-2xl" />
          </button>
        </div>
      </div>

      <div className="border-b">
        <div className="flex container mx-auto text-neutral-500 hover:text-neutral-600 px-2">
          <button onClick={() => window.location.replace("/admin/users")} className="flex gap-2 py-4 px-2 hover:bg-neutral-100">
            <FiUsers className="mt-1" /> 
            Users
          </button>
          <button onClick={() => window.location.replace("/admin/logs")} className="flex gap-2 py-4 px-2 hover:bg-neutral-100">
            <FiActivity className="mt-1" /> 
            Logs
          </button>
        </div>
      </div>

      { 
        showModal ? (
          <Modal title="Account" onClose={() => setShowModal(false)}>
            <button onClick={() => signOut({callbackUrl: '/admin'})} className="hover:bg-neutral-200 rounded p-2 mt-2 w-full flex gap-2">
              <FiLogOut className="my-1" /> 
              <p>Sign out</p>
            </button>
          </Modal>
        ) : null 
      }
    </div>
  )
}
