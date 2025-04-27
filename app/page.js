"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useRef } from 'react';



export default function Home() {

  const scrollContainerRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault(); // Prevent default scrolling behavior
      const scrollAmount = e.deltaY; // Amount of scroll

      // Smooth scroll with requestAnimationFrame
      const scrollContainer = scrollContainerRef.current;
      const start = scrollContainer.scrollLeft;
      const end = start + scrollAmount;
      const duration = 300; // Duration for the scroll animation (in ms)
      let startTime;

      const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const scrollProgress = Math.min(progress / duration, 1); // Calculate the progress (0 to 1)
        const currentScroll = start + (end - start) * scrollProgress;

        scrollContainer.scrollLeft = currentScroll;

        if (scrollProgress < 1) {
          requestAnimationFrame(animateScroll); // Continue the animation
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(1);

  const [events, setEvents] = useState([]);

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data); // Set the events data to state
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);



  const sections = {
    vision: "We envision a connected community where alumni support each other and give back.",
    mission: "Our mission is to create a strong alumni network that fosters growth and collaboration.",
    "executive members": "Meet our dedicated team that works tirelessly to bring alumni together.",
    advisor: "Our association has a rich history of connecting graduates for over a decade.",
  };

  const [selected, setSelected] = useState("vision");



  const handleRegister = async () => {
    const res = await axios.post("/api/payment/initiate", { email, password });

    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      alert(res.data.error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Your client-side code here
    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev % 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center min-h-screen">

      {/* nav section */}
      <nav className="text-white/60 py-4 w-full px-2 mt-4 navbar-end items-center justify-between bg-gradient-to-r from-base-200 to-secondary/90 font-semibold ">
        <div>
          <a href="/" className=" font-bold mx-2">Alumni Association</a>
        </div>
        <div className="flex justify-between items-center">
          <div className="items-center">
            <ul className="flex items-center">
              <li><a href="/" className="px-4 hover:text-neutral">Home</a></li>
              <li><a href="/news" className="px-4 hover:text-neutral">News/events</a></li>
              <li><a href="/blogs" className="px-4 hover:text-neutral">Blogs</a></li>
              {/* <li><a href="/notice" className="px-4 hover:text-neutral">Notice</a></li> */}
              <li><a href="/login" className="px-4 hover:text-neutral cursor-pointer">Members Portal</a></li>
              <li><a href="/club" className="px-4 hover:text-neutral cursor-pointer">Club</a></li>
              {/* <li><a onClick={() => router.push("/register")} className="px-4 hover:text-neutral cursor-pointer">Register</a></li> */}
              <li><a href="/about" className="px-4 hover:text-neutral">About Us</a></li>
              <li><a href="/contact" className="px-4 hover:text-neutral">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </nav>


      {/* hero section */}
      <section className="  hero mt-4 relative">
        <div className=" carousel w-full opacity-40">
          <div className={`carousel-item relative w-full ${currentSlide === 1 ? 'block' : 'hidden'}`}>
            <img src="https://picsum.photos/1500/600?random=1" alt="Community" className="w-full" />
          </div>
          <div className={`carousel-item relative w-full ${currentSlide === 2 ? 'block' : 'hidden'}`}>
            <img src="https://picsum.photos/1500/600?random=2" alt="Education" className="w-full" />
          </div>
          <div className={`carousel-item relative w-full ${currentSlide === 3 ? 'block' : 'hidden'}`}>
            <img src="https://picsum.photos/1500/600?random=3" alt="Event" className="w-full" />
          </div>
        </div>

        {/* Join button with heading over carousel */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white-content">
          <h2 className="text-4xl text-white/50 font-semibold mb-4 hover:text-white/40">Join the Alumni Association</h2>
          <button onClick={() => router.push("/register")} className="btn bg-neutral/60 text-neutral-content ">Join Now</button>
        </div>
      </section>

      {/* About Us section */}
      <section className="mt-4 pb-10 bg-slate-700 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto text-center">

          <div className="bg-gradient-to-r from-base-200 to-secondary ">
            <h2 className="text-4xl font-bold mb-6 text-white/50 hover:text-white/50 py-10">About Us</h2>
          </div>

          <p className=" mb-12 leading-relaxed px-20 text-white/50">
            The Alumni Association is more than just a community—it's a family built on shared experiences, lifelong learning, and mutual support. Our mission is to foster strong connections among graduates, provide opportunities for professional and personal growth, and give back to the institution that shaped us.
          </p>

          <div className="flex flex-col md:flex-row px-20 py-5 w-full">

            {/* Left - Menu */}
            <div className="w-full rounded-l-lg md:w-1/5 bg-neutral/60 text-neutral-content font-semibold py-10  p-4">
              <ul className="space-y-2">
                {Object.keys(sections).map((key) => (
                  <li key={key}>
                    <button
                      onClick={() => setSelected(key)}
                      className={`w-full text-left p-2 rounded-md ${selected === key ? "bg-gradient-to-r from-base-200 to-secondary/90 text-white/50" : "hover:bg-base-100 hover:text-white"
                        }`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Content */}
            <div className="w-full md:w-5/6 p-4 bg-base-100 rounded-r-lg text-white/50">
              <h2 className="font-bold text-white/50">{selected.charAt(0).toUpperCase() + selected.slice(1)}</h2>
              <p className="mt-2 text-start">{sections[selected]}</p>
            </div>

          </div>

        </div>
      </section>


      {/* Benefit of Alumni Association section */}
      <section className=" mt-4 bg-slate-700 ">
        <div className="max-w-7xl mx-auto text-center ">
          <div className="bg-gradient-to-r from-base-200 to-secondary/90 ">
            <h2 className="text-4xl font-bold mb-6 text-white/50 hover:text-white/50 py-10">Benefits of Alumni Association</h2>
          </div>
          <p className="mb-10 px-20 text-white/50 text-start">
            As a member of our Alumni Association, you unlock numerous opportunities to grow, stay connected, and give back to the community. Here are just a few of the amazing benefits you'll enjoy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-20 mb-10">


            <div className="card bg-base-100 shadow-lg flex flex-col">
              {/* Top Part - Title */}
              <div className="flex items-center justify-center bg-neutral/60 to-success py-8 text-neutral-content rounded-t-lg">
                <h2 className=" font-bold text-center">Networking Opportunities</h2>
              </div>

              {/* Bottom Part - Content */}
              <div className="p-4">
                <p className="text-start text-white/50">
                  Connect with thousands of alumni around the world! Whether it's for career advice, mentorship, or collaboration, the network is vast and supportive.
                </p>
              </div>
            </div>


            <div className="card bg-base-100 shadow-lg  flex flex-col">
              {/* Top Part - Title */}
              <div className="flex items-center justify-center bg-neutral/60 py-8 text-neutral-content rounded-t-lg">
                <h2 className=" font-bold text-center">Exclusive Alumni Events</h2>
              </div>

              {/* Bottom Part - Content */}
              <div className="p-4">
                <p className="text-start text-white/50">
                  Attend reunions, seminars, and workshops that provide exclusive opportunities to learn, reconnect, and grow professionally and personally.
                </p>
              </div>
            </div>


            <div className="card bg-base-100 shadow-lg  flex flex-col">
              {/* Top Part - Title */}
              <div className="flex items-center justify-center bg-neutral/60 py-8 text-neutral-content rounded-t-lg">
                <h2 className=" font-bold text-center">Career Support & Growth</h2>
              </div>

              {/* Bottom Part - Content */}
              <div className="p-4">
                <p className="text-start text-white/50">
                  Get access to job openings, career coaching, and development programs. The Alumni Association is committed to helping you achieve your career goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* News/Events Section */}
      <section className="w-full mt-4 bg-slate-700">
        <div className="bg-gradient-to-r from-base-200 to-secondary/90 mb-6">
          <h2 className="text-4xl font-bold text-center text-white/50 hover:text-white/50 py-10">Latest News & Events</h2>
        </div>

        {/* Horizontal Scroll Section */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-3 mb-5 pb-10 mx-20"
          onWheel={handleWheel} // Add the wheel event listener here
        >
          {/* Dynamically rendered News/Event Cards */}
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="min-w-[350px] max-w-[400px] bg-base-100 shadow-lg rounded-md overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white/50">{event.title}</h3>
                  <p className=" text-white/50 mt-2">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white/50">No events or news available.</p>
          )}
        </div>
      </section>


      {/* Footer section */}
      <div className="text-center py-10 mt-4 bg-slate-700 min-w-7xl">
       

        <span className="block text-sm text-center text-neutral">© 2021-2022 Landwind™. All Rights Reserved. Developed by
          <a href="https://github.com/TusharJarif10"
            className="text-base-300 hover:underline"> TusharJarif10</a>
         
        </span>

        <ul className="flex justify-center mt-5 space-x-5">
          <li>
            <a href="#" className="text-white/50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path 
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  ></path>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" className="text-white/50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path 
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  ></path>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" className="text-white/50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                </path>
              </svg>
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
}
