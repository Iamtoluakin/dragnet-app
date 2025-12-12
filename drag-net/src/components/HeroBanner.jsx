import React from 'react';
import Logo from '../../public/logo-dragnet.svg';

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-b from-sky-900 to-sky-700 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:flex md:items-center">
        <div className="md:w-1/2">
          <img src={Logo} alt="Dragnet logo" className="w-40 mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Intelligent compliance, tailored to every role.
          </h1>
          <p className="mt-4 text-sky-100 max-w-prose">
            Dragnet uses AI to identify the exact policies, courses and tests your staff need — automatically. Reduce risk, get audit-ready, and scale compliance without manual mapping.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/get-started" className="bg-white text-sky-800 px-5 py-3 rounded-lg font-semibold shadow">Get Started</a>
            <a href="/demo" className="border border-white/30 px-5 py-3 rounded-lg">Request Demo</a>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-10 flex justify-center">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 w-full max-w-md backdrop-blur">
            <h3 className="text-white text-lg font-semibold mb-3">Preview your compliance path</h3>
            <form className="space-y-3">
              <input className="w-full p-3 rounded-md bg-white/10 text-white border border-white/20" placeholder="Sector (Police, Civil Service...)" />
              <input className="w-full p-3 rounded-md bg-white/10 text-white border border-white/20" placeholder="Job Title" />
              <button className="mt-2 w-full bg-white text-sky-900 font-bold py-3 rounded-md">Get My Path</button>
            </form>
            <p className="mt-3 text-sky-100 text-sm">No account needed for preview.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
