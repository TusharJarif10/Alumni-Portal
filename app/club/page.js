'use client';

import React from 'react';

const clubs = [
  {
    name: 'Technology & Innovation Club',
    lead: 'Anjali Mehra',
    established: 2016,
    description:
      'Focused on the latest tech trends, innovation projects, and professional networking with alumni in the tech sector.',
    members: 215,
    category: 'Technology',
  },
  {
    name: 'Performing Arts Circle',
    lead: 'Rohit Sharma',
    established: 2011,
    description:
      'Promotes theatre, music, and dance among alumni. Hosts annual showcases and alumni-led creative workshops.',
    members: 132,
    category: 'Arts',
  },
  {
    name: 'Sports & Fitness Network',
    lead: 'Tina D’Souza',
    established: 2009,
    description:
      'Encouraging active lifestyles and sportsmanship through alumni tournaments, runs, and virtual wellness meets.',
    members: 300,
    category: 'Health & Sports',
  },
  {
    name: 'Literary & Debate Club',
    lead: 'Farhan Qureshi',
    established: 2013,
    description:
      'Book discussions, essay contests, and thought-provoking debate forums that keep minds sharp and connected.',
    members: 170,
    category: 'Literature',
  },
];

const ClubPage = () => {
  return (
    <main className="bg-slate-900 min-h-screen py-12 px-6 md:px-12 text-slate-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-300">Alumni Clubs & Societies</h1>
        <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
          Join dynamic alumni communities — innovate, collaborate, and grow through shared passions and professions.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-indigo-300 mb-4">Filter</h2>
            <div className="form-control mb-5">
              <label className="label">
                <span className="label-text text-slate-300">Category</span>
              </label>
              <select className="select select-bordered bg-slate-700 text-slate-100">
                <option value="">All</option>
                <option>Technology</option>
                <option>Arts</option>
                <option>Health & Sports</option>
                <option>Literature</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-300">Founded After</span>
              </label>
              <input type="number" className="input input-bordered bg-slate-700 text-slate-100" placeholder="e.g. 2010" />
            </div>
          </div>
        </aside>

        {/* Club Listings */}
        <section className="md:col-span-3 space-y-8">
          {clubs.map((club, idx) => (
            <div
              key={idx}
              className="bg-slate-800 rounded-xl p-6 shadow-md border border-slate-700 hover:border-indigo-400 transition"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3">
                <h3 className="text-2xl font-semibold text-white">{club.name}</h3>
                <span className="text-sm text-slate-400 mt-2 lg:mt-0">
                  🎓 Established: {club.established}
                </span>
              </div>
              <p className="text-slate-300 mb-4">{club.description}</p>
              <div className="flex flex-wrap justify-between items-center text-sm text-slate-400">
                <span>👤 Lead: {club.lead}</span>
                <span>🏷️ Category: {club.category}</span>
                <span>👥 Members: {club.members}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="btn btn-sm btn-outline btn-accent">Join Club</button>
                <button className="btn btn-sm btn-outline text-white border-slate-600 hover:border-indigo-400">More Info</button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Alumni Network. Empowering lifelong connections.
      </footer>
    </main>
  );
};

export default ClubPage;
