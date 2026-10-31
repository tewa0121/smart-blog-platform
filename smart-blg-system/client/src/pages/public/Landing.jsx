import { Link } from 'react-router-dom';

const features = [
  ['✍️', 'Write and publish', 'Create posts with images and categories, and save drafts before publishing.'],
  ['✅', 'Editorial review', 'Editors check grammar, then approve, reject with feedback, or publish.'],
  ['🛡️', 'Role-based access', 'Admin, Editor, Author, Contributor and Subscriber each get their own dashboard.'],
  ['💬', 'Comments', 'Readers join the discussion on every published post.'],
  ['🔔', 'Notifications', 'Get notified about reviews, approvals, new posts and comments.'],
  ['🤖', 'AI assistance', 'Grammar check, summaries, keywords and title suggestions while you write.'],
];

const steps = [
  ['1', 'Register', 'Create a free account in seconds.'],
  ['2', 'Write', 'Authors and contributors create posts.'],
  ['3', 'Review', 'Editors check and approve the content.'],
  ['4', 'Publish', 'Approved posts go live for everyone.'],
  ['5', 'Discuss', 'Readers comment and share ideas.'],
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Top bar */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-indigo-600">📝 Smart Blog System</span>
          <div className="flex gap-2">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            A smart place to <span className="text-indigo-600">write, review and share</span> knowledge
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Smart Blog System is a modern web platform where people create, manage, publish and share
            articles. Every post goes through a simple editorial workflow so readers always get
            clear, checked and trustworthy content.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary !px-6 !py-3 text-base">Get Started</Link>
            <Link to="/login" className="btn-outline !px-6 !py-3 text-base">Login</Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Just want to read?{' '}
            <Link to="/home" className="text-indigo-600 hover:underline">Browse published posts</Link>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">What you can do</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, text]) => (
            <div key={title} className="card p-6">
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(([n, title, text]) => (
              <div key={n} className="card p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">{n}</div>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to start?</h2>
        <p className="mt-2 text-gray-600">Create your account and join the community today.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="btn-primary !px-6 !py-3 text-base">Get Started</Link>
          <Link to="/login" className="btn-outline !px-6 !py-3 text-base">Login</Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Blog System. University Project.
      </footer>
    </div>
  );
}