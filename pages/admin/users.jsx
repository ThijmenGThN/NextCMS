import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiEdit, FiTrash, FiUserPlus } from 'react-icons/fi'

import NavBar from '/source/components/admin/navbar.jsx'
import Modal from '/source/components/modal.jsx'

export default function AdminUsers() {
  const {data: session, status} = useSession()

  const [users, setUsers] = useState([])

  const [showUserModal, setShowUserModal] = useState()
  const [showModalConfirm, setShowModalConfirm] = useState()
  const [showModalAdd, setShowModalAdd] = useState()
  
  const [modalUsername, setModalUsername] = useState()
  const [modalPermission, setModalPermission] = useState()
  const [modalNewPassword, setModalNewPassword] = useState('')
  const [modalNewPasswordConfirm, setModalNewPasswordConfirm] = useState('')

  useEffect(() => {
    axios.get('/api/admin/users/list')
      .then(({data}) => setUsers(data))
  }, [])

  useEffect(() => {
    if (!session && status != 'loading') window.location.replace('/admin')
  }, [status])

  const userAction = {
    edit: {
      modal: user => {
        setModalUsername(user.username)
        setModalPermission(user.permission)
        setShowUserModal(true)
        setModalNewPassword('')
        setModalNewPasswordConfirm('')
      },
      submit: async () => {
        await axios.post('/api/admin/users/edit', {params: {
          username: modalUsername,
          permission: modalPermission,
          password: modalNewPassword
        }})

        if (modalUsername == session.user.name) return window.location.replace('/admin')

        axios.get('/api/admin/users/list')
          .then(({data}) => setUsers(data))

        setShowUserModal(false)
      }
    },
    delete: {
      modal: user => {
        setModalUsername(user.username)
        setShowModalConfirm(true)
      },
      confirm: async () => {
        await axios.post('/api/admin/users/delete', {params: {username: modalUsername}})

        if (modalUsername == session.user.name) return window.location.replace('/admin')

        axios.get('/api/admin/users/list')
          .then(({data}) => setUsers(data))

        setShowModalConfirm(false)
      }
    },
    add: {
      modal: () => {
        setShowModalAdd(true)
        setModalUsername('')
        setModalPermission(0)
        setModalNewPassword('')
        setModalNewPasswordConfirm('')
      },
      submit: async () => {
        await axios.post('/api/admin/users/add', {params: {
          username: modalUsername,
          permission: modalPermission,
          password: modalNewPassword
        }})

        if (modalUsername == session.user.name) return window.location.replace('/admin')

        axios.get('/api/admin/users/list')
          .then(({data}) => setUsers(data))

          setShowModalAdd(false)
      }
    }
  }

  return (
    <>
      <NavBar />

      <div className="container mx-auto p-4">
        <div className="bg-white rounded border-t-4 border-cyan-500">
          <div className="border-b p-4 flex">
            <p className="my-1">Users</p>

            <button onClick={userAction.add.modal} className="bg-cyan-500 ml-auto hover:bg-cyan-600 py-2 px-3 rounded text-white flex text-sm"><FiUserPlus className="mt-0.5 mr-2 text-base" /> Add User</button>
          </div>

          <div className="grid grid-cols-3 text-center text-neutral-500 p-2 text-sm">
            <p>Name</p>
            <p>Role</p>
            <p>Actions</p>
          </div>

          <ul>
            {
              users.map((user, id) => (
                <li key={id} className="grid grid-cols-3 text-center border-t px-2">
                    <p className="py-4">{user.username}</p>

                    <p className="py-4">{
                      user.permission == 0 ? 'Unprivileged' :  
                      user.permission == 1 ? 'Viewer' :  
                      user.permission == 2 ? 'Moderator' :  
                      user.permission == 4 ? 'Administrator' : null 
                    }</p>

                    <div className="gap-2 flex justify-center my-3 text-white">
                      {
                        (session?.user.permission > user.permission ||
                        session?.user.permission == 4) &&
                        session?.user.permission > 1
                        ? ( 
                          <>
                            <button onClick={() => userAction.edit.modal(user)} className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded"><FiEdit /></button>
                            <button onClick={() => userAction.delete.modal(user)} className="bg-red-500 hover:bg-red-600 p-2 rounded"><FiTrash /></button>
                          </> 
                        ) : ( 
                          <>
                            <button className="bg-neutral-400 cursor-default p-2 rounded"><FiEdit /></button>
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
        showUserModal ? (
          <Modal title='Edit User' onClose={() => setShowUserModal(false)}>
            <div className="flex flex-col gap-4">
              <div>
                <p>Username <span className="text-red-500">*</span></p>
                <input type="text" disabled onChange={({target}) => setModalUsername(target.value)} value={modalUsername} placeholder="Administrator" className="p-2 bg-neutral-100 w-full text-neutral-400 rounded" />
              </div>

              <div>
                <p>Role <span className="text-red-500">*</span></p>
                { 
                  modalUsername != session.user.name ? (
                    <select onChange={({target}) => setModalPermission(target.value)} className="w-full p-2 rounded bg-neutral-100 hover:bg-neutral-200">
                      <option value="0" selected={modalPermission == 0 ? true : false}>Unprivileged</option>
                      <option value="1" selected={modalPermission == 1 ? true : false}>Viewer</option>
                      <option value="2" selected={modalPermission == 2 ? true : false}>Moderator</option>
                      <option value="4" selected={modalPermission == 4 ? true : false}>Administrator</option>
                    </select>
                  ) : (
                    <input type="text" disabled value={
                      modalPermission == 0 ? 'Unprivileged' : 
                      modalPermission == 1 ? 'Viewer' :
                      modalPermission == 2 ? 'Moderator' : 
                      modalPermission == 4 ? 'Administrator' : null
                    } className="p-2 bg-neutral-100 w-full text-neutral-400 rounded" />
                  )
                }
              </div>

              <div className="flex flex-col">
                <p>Password <span className="text-sm italic text-cyan-500">(update)</span></p>
                <input type="password" placeholder='••••••••' onChange={({target}) => setModalNewPassword(target.value)} className="hover:bg-neutral-100 p-2 w-full border rounded mb-2" />

                <p>Confirm</p>
                <input type="password" placeholder='••••••••' onChange={({target}) => setModalNewPasswordConfirm(target.value)} className="hover:bg-neutral-100 p-2 w-full border mb-1 rounded" />

                {
                  modalNewPassword != modalNewPasswordConfirm ? (
                    <p className="text-sm text-red-500 italic">Passwords do not match*</p>
                  ) : null
                }
                {
                  modalNewPassword.length < 6 && modalNewPassword.length > 0 ? (
                    <p className="text-sm text-red-500 italic">Password not long enough*</p>
                  ) : null
                }
              </div>

              <div className="flex gap-2 ml-auto">
                <button onClick={() => setShowUserModal(false)} className="py-1 px-4 hover:bg-neutral-100 border rounded">Cancel</button>
                {
                  modalNewPassword == modalNewPasswordConfirm && (modalNewPassword.length == 0 || modalNewPassword.length >= 6) ? (
                    <button onClick={userAction.edit.submit} className="py-1 px-4 bg-cyan-500 hover:bg-cyan-600 rounded text-white">Save</button>
                  ) : (
                    <button className="py-1 px-4 cursor-not-allowed bg-neutral-400 rounded text-white">Save</button>
                  )
                }
              </div>
            </div>
          </Modal>
        ) : null 
      }

      { 
        showModalAdd ? (
          <Modal title='Create User' onClose={() => setShowModalAdd(false)}>
            <div className="flex flex-col gap-4">
              <div>
                <p>Username <span className="text-red-500">*</span></p>
                <input type="text" onChange={({target}) => setModalUsername(target.value)} value={modalUsername} placeholder="Administrator" className="p-2 bg-neutral-100 hover:bg-neutral-200 w-full rounded" />
              </div>

              <div>
                <p>Role <span className="text-red-500">*</span></p>
                <select onChange={({target}) => setModalPermission(target.value)} className="w-full p-2 rounded bg-neutral-100 hover:bg-neutral-200">
                  <option selected disabled>― Select a Role ―</option>
                  <option value="0">Unprivileged</option>
                  <option value="1">Viewer</option>
                  <option value="2">Moderator</option>
                  <option value="4">Administrator</option>
                </select>
              </div>

              <div className="flex flex-col">
                <p>Password <span className="text-sm italic text-cyan-500">(update)</span></p>
                <input type="password" placeholder='••••••••' onChange={({target}) => setModalNewPassword(target.value)} className="hover:bg-neutral-100 p-2 w-full border rounded mb-2" />

                <p>Confirm</p>
                <input type="password" placeholder='••••••••' onChange={({target}) => setModalNewPasswordConfirm(target.value)} className="hover:bg-neutral-100 p-2 w-full border mb-1 rounded" />

                {
                  modalNewPassword != modalNewPasswordConfirm ? (
                    <p className="text-sm text-red-500 italic">Passwords do not match*</p>
                  ) : null
                }
                {
                  modalNewPassword.length < 6 && modalNewPassword.length > 0 ? (
                    <p className="text-sm text-red-500 italic">Password not long enough*</p>
                  ) : null
                }
              </div>

              <div className="flex gap-2 ml-auto">
                <button onClick={() => setShowModalAdd(false)} className="py-1 px-4 hover:bg-neutral-100 border rounded">Cancel</button>
                {
                  modalUsername && modalPermission && modalNewPassword == modalNewPasswordConfirm && (modalNewPassword.length == 0 || modalNewPassword.length >= 6) ? (
                    <button onClick={userAction.add.submit} className="py-1 px-4 bg-cyan-500 hover:bg-cyan-600 rounded text-white">Save</button>
                  ) : (
                    <button className="py-1 px-4 cursor-not-allowed bg-neutral-400 rounded text-white">Save</button>
                  )
                }
              </div>
            </div>
          </Modal>
        ) : null 
      }

      { 
        showModalConfirm ? (
          <Modal title='User Deletion' danger type="confirm" timeout={2} onConfirm={userAction.delete.confirm} confirm="Delete" onClose={() => setShowModalConfirm(false)}>
            <input type="text" disabled value={modalUsername} className="mt-2 p-2 bg-neutral-100 w-full rounded" />
          </Modal>
        ) : null 
      }
    </>
  )
}
