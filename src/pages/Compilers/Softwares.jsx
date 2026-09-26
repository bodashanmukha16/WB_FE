import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import staticSoftwares from "../../Data/Softwares.json";
import { BASE_API_URL } from "../../config/apiConfig";

export default function Softwares() {
  const [softwaresData, setSoftwaresData] = useState(staticSoftwares);
  const [updatedResult, setUpdated] = useState(staticSoftwares);
  const [updatedValue, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSoftwaresFromBackend();
  }, []);

  const fetchSoftwaresFromBackend = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/superadmin/public/softwares`);
      if (response.data.success && Array.isArray(response.data.softwares) && response.data.softwares.length > 0) {
        const formatted = response.data.softwares.map(s => ({
          id: s.softwareId || s._id,
          name: s.name,
          language: s.language,
          category: s.category,
          icon: s.icon || "fa-download",
          color: s.color || "from-blue-500 to-blue-700",
          url: s.url,
          description: s.description || ""
        }));
        setSoftwaresData(formatted);
        setUpdated(formatted);
      }
    } catch (err) {
      console.warn("Using static softwares fallback due to backend response:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const newResult = (e) => {
    const value = e.target.value;
    setValue(value);

    if (value.trim() === "") {
      setUpdated(softwaresData);
      return;
    }
    const items1 = softwaresData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      (item.language && item.language.toLowerCase().includes(value.toLowerCase()))
    );

    setUpdated(items1);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-widest inline-block mb-3">
              Super Admin Managed Softwares Catalog
            </span>
            <h1 className="text-4xl font-bold text-slate-900">
              Opensource Programming Software
            </h1>
            <p className="text-slate-600 mt-2 text-sm max-w-xl mx-auto">
              Download required developer tools, compilers, and IDE packages for course practicals.
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto mb-8">
            <input
              className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-xl pl-4 pr-10 py-3 transition duration-300 ease focus:outline-none focus:border-emerald-500 shadow-sm"
              placeholder="Search software by name or language..."
              onChange={newResult}
              value={updatedValue}
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium">
              Loading downloadable software tools...
            </div>
          ) : updatedResult.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No software found matching "{updatedValue}"
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {updatedResult.map((software) => (
                <div
                  key={software.id}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-slate-100 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${software.color || 'from-emerald-500 to-teal-600'} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                      <i className={`fas ${software.icon || 'fa-download'} text-white text-2xl`}></i>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{software.name}</h3>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md mb-4">
                      {software.language || 'Tools'} ({software.category || 'General'})
                    </span>

                    {software.description && (
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">{software.description}</p>
                    )}
                  </div>

                  <a
                    href={software.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block w-full text-center py-3 bg-gradient-to-r ${software.color || 'from-emerald-500 to-teal-600'} text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 mt-4`}
                  >
                    Download Software
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
