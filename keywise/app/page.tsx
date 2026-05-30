export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 text-center">
      <h1 className="text-5xl font-bold">
        KeyWise
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-xl">
        AI-powered real estate marketing assistant that helps homeowners create listings, descriptions, and marketing content in minutes.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 rounded-lg bg-black text-white">
          Get Started
        </button>

        <button className="px-6 py-3 rounded-lg border">
          Learn More
        </button>
      </div>
    </main>
  )
}