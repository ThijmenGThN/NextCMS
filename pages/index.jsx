import Link from 'next/link'

export default function index() {
  return (
    <div className="mt-20">
      <p className="font-bold text-4xl text-center m-2">Next CMS</p>
      <p className="font-mono italic text-center flex flex-col">
        <a rel="noreferrer" href="https://github.com/ThijmenGThN/" target="_blank">
          Developed by <span className="text-cyan-500">ThijmenGThN</span>
        </a>

        <Link href="/admin">
          <button className="text-neutral-500 hover:bg-neutral-300 italic mx-auto mt-4 py-2 px-4 bg-neutral-200 rounded">
            Sign in as Admin
          </button>
        </Link>
      </p>
    </div>
  )
}
