import { useState } from "react";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import compilers from "../../Data/compilers.json";

export default function Compiler() {
  const [updatedResult, setUpdated] = useState(compilers)
  const [updatedValue, setValue] = useState("")

  const newResult = (e)=>{
     const value = e.target.value;
     setValue(value);

    if (value.trim() === "") {
    setUpdated(compilers)
    return;
  }
    const items1 = compilers.filter(item=>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.language.toLowerCase().includes(value.toLowerCase())
      
    )

    setUpdated(items1)
  }

  
  return (
    <>
      <Header></Header>

      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">
            Online Programming Compilers
          </h1>
          <div className="w-full max-w-sm min-w-[200px] mb-4">
            <input
              className="w-full bg-transparent placeholder:text-slate-900 text-slate-700 text-sm border border-slate-800 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search Your compiler" onChange={newResult} value={updatedValue}
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {updatedResult.map((compiler) => (
              <div
                key={compiler.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <i className={`fas ${compiler.icon} text-white text-2xl`}></i>
                </div>

                <h3 className="text-2xl font-bold mb-3">{compiler.name}</h3>

                <p className="text-gray-600 mb-6">{compiler.description}</p>

                <a
                  href={compiler.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Open Compiler
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
