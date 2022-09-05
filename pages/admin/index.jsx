import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { FiHome } from 'react-icons/fi' 

export default function Admin() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState()

  const authenticate = () => signIn('credentials', {username, password, callbackUrl: '/admin/users'})

  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get('error') ? true : false)
  }, [])

  return (
    <>
      <p className="text-2xl mt-10 text-center font-bold">Next CMS</p>

      <div onKeyPress={({key}) => {if (key == "Enter") authenticate()}} className="mx-auto mt-5 max-w-[350px] bg-white rounded-lg border flex flex-col p-4 gap-1">
        <p className="text-sm text-neutral-500 ml-1">Username</p>
        <input autoFocus onChange={({target}) => setUsername(target.value)} className={"p-2 border rounded mb-2 " + (error ? 'border-red-500 bg-red-50 hover:bg-red-100' : 'hover:bg-neutral-100')} type="text" placeholder="Administrator" />
        <p className="text-sm text-neutral-500 ml-1">Password</p>
        <input onChange={({target}) => setPassword(target.value)} className={"p-2 border rounded mb-2 " + (error ? 'border-red-500 bg-red-50 hover:bg-red-100' : 'hover:bg-neutral-100')} type="password" placeholder="••••••••" />

        <div className="flex gap-2">
          <button onClick={authenticate} className="bg-cyan-500 py-2 w-full text-white rounded hover:bg-cyan-600">Sign in</button>
          <Link href="/">
            <div className="text-cyan-500 border-2 rounded border-cyan-500 py-2 px-3 hover:bg-neutral-100 text-xl">
              <FiHome />
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
