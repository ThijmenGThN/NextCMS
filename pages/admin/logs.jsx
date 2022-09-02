import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiTrash, FiEye } from 'react-icons/fi'

import NavBar from '/source/components/admin/navbar.jsx'
import Modal from '/source/components/modal.jsx'

export default function AdminUsers(props) {
  const {data: session, status} = useSession()

  const [logs, setLogs] = useState([])

  const [showModalView, setShowModalView] = useState()
  const [showModalConfirm, setShowModalConfirm] = useState()
  const [modalUser, setModalUser] = useState()
  const [modalContext, setModalContext] = useState()
  const [modalLogId, setModalLogId] = useState()

  useEffect(() => {
    axios.get('/api/admin/logs/list')
      .then(({data}) => setLogs(data))
  }, [])

  useEffect(() => {
    if (!session && status != 'loading') window.location.replace('/admin')
  }, [status])

  const userAction = {
    log: {
      delete: {
        dialog: async log => {
          setModalUser(log.user)
          setModalContext(log.context)
          setModalLogId(log.id)
          setShowModalConfirm(true)
        },
        confirm: async () => {
          await axios.post('/api/admin/logs/delete', {params: {id: modalLogId}})

          axios.get('/api/admin/logs/list')
            .then(({data}) => setLogs(data))
            
          setShowModalConfirm(false)
        }
      },
      view: async log => {
        setModalUser(log.user)
        setModalContext(log.context)
        setShowModalView(true)
      }
    }
  }

  return (
    <>
      <NavBar />

      <div className="container mx-auto p-4">
        <div className="bg-white rounded border-t-4 border-cyan-500">
          <div className="border-b p-4">
            <p className="my-1">Logs</p>
          </div>

          <div className="grid grid-cols-3 text-center text-neutral-500 p-2 text-sm">
            <p>User</p>
            <p>Context</p>
            <p>Actions</p>
          </div>

          <ul>
            {
              logs.map((log, id) => (
                <li key={id} className="grid grid-cols-3 text-center border-t px-2">
                  <p className="py-4">{log.user}</p>
                  <button className="py-4 truncate">{log.context}</button>

                  <div className="gap-2 flex justify-center my-3 text-white">
                    <button onClick={() => userAction.log.view(log)} className="bg-cyan-500 hover:bg-cyan-600 cursor-default p-2 rounded"><FiEye /></button>
                    {
                      session?.user.permission > 1 ? ( 
                        <>
                          <button onClick={() => userAction.log.delete.dialog(log)} className="bg-red-500 hover:bg-red-600 p-2 rounded"><FiTrash /></button>
                        </> 
                      ) : ( 
                        <>
                          <button className="bg-neutral-400 cursor-default p-2 rounded"><FiTrash /></button>
                        </>
                      )
                    }
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      { 
        showModalView ? (
          <Modal title='Log Context' onClose={() => setShowModalView(false)}>
            <input type="text" disabled value={modalUser} className="mt-2 p-2 bg-neutral-100 w-full rounded" />
            
            <p className="mt-2 p-2 bg-neutral-100 w-full rounded min-h-[64px]">{modalContext}</p>

            <div className="flex mt-4">
              <button onClick={() => setShowModalView(false)} className="py-1 px-4 ml-auto hover:bg-neutral-100 border rounded">Close</button>
            </div>
          </Modal>
        ) : null 
      }

      {
        showModalConfirm ? (
          <Modal type="confirm" danger confirm="Delete" onClose={() => setShowModalConfirm(false)} onConfirm={userAction.log.delete.confirm}>
            <input type="text" disabled value={modalUser} className="mt-2 p-2 bg-neutral-100 w-full rounded" />
            <p className="mt-2 p-2 bg-neutral-100 w-full rounded min-h-[64px]">{modalContext}</p>
          </Modal>
        ) : null
      }
    </>
  )
}
