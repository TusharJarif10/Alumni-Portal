"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get("/api/blogs");
            setBlogs(res.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    return (
        <>


            <div className="min-h-screen flex flex-col p-8 sm:p-16 md:p-24 justify-center bg-base-300">
                <h1 className="text-5xl font-bold my-10 mb-20 text-center ">Alumni Feed</h1>
                <div className="mx-auto max-w-6xl bg-base-300">
                    <ul className="my-2">
                        {blogs.map((blog) => (
                            <li key={blog.id} className=" bg-base-100 p-4 mb-4 rounded-lg ">
                                <section className="font-sans ">
                                    <div className="[ lg:flex lg:items-center ] [ fancy-corners fancy-corners--large fancy-corners--top-left fancy-corners--bottom-right ]">
                                        <div className="flex-shrink-0 self-stretch sm:flex-basis-40 md:flex-basis-50 xl:flex-basis-60">
                                            <div className="h-full">
                                                <article className="h-full">
                                                    <div className="h-full">
                                                        <img className="h-full object-cover" src="https://inviqa.com/sites/default/files/styles/pullout/public/2020-08/XD-1.jpeg?h=f75d236a&itok=PBoXPDmW" width="733" height="412" alt='""' typeof="foaf:Image" />
                                                    </div>
                                                </article>
                                            </div>
                                        </div>
                                        <div className="p-6 ">
                                            <div className="leading-relaxed">
                                                <h2 className="leading-tight text-4xl font-bold ">{blog.title}</h2>
                                                <p className="mt-4">{blog.content}</p>
                                                <p className="mt-4 ">Author: {blog.authorEmail}</p>

                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </li>
                        ))}
                    </ul>

                    <h2 className="sr-only">Featured case study</h2>

                </div>
            </div>


        </>


    );
}
