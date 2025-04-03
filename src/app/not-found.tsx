import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-6">Could not find the requested page</p>
      <Link 
        href="https://www.takeplace.ca"
        className="inline-flex items-center btn-grey py-2 px-4 hover:bg-gray-200 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
} 