import { useState, useEffect } from "react";
import axios from "axios";
import notificationsData from "../../Data/university_notifications.json";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { getStudentOrgId, getStudentOrgDetails } from "../../config/tenantConfig";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [orgDetails, setOrgDetails] = useState(() => getStudentOrgDetails());

  const getStudentProfile = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const branch = (u.branch || u.department || "all").toLowerCase();
      const year = u.year || "all";
      return { branch, year };
    } catch (e) {
      return { branch: "all", year: "all" };
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const orgId = getStudentOrgId();
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const { branch, year } = getStudentProfile();

      const response = await axios.get(`${apiBase}/notifications`, {
        headers: { "x-tenant-id": orgId },
        params: { department: branch, year }
      });

      if (response.data && response.data.success && Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.warn("Failed to fetch live notifications from API, falling back to local dataset:", error);
      setNotifications(notificationsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOrgDetails(getStudentOrgDetails());
    loadNotifications();
  }, []);

  const categories = ["All", ...new Set(notifications.map((n) => n.category || "Academic"))];

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((n) => (n.category || "Academic") === filter);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {orgDetails?.name || "Institution"} Announcements
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              University News & Updates
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Stay updated with official announcements, exam circulars, results, and events published by {orgDetails?.name || "your institution"}.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full border text-sm font-semibold transition shadow-sm ${
                  filter === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {loading ? (
            <div className="py-16 text-center text-gray-500 font-bold">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Fetching latest announcements from {orgDetails?.name || "Institution"} database...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl shadow-sm text-center text-gray-500 font-semibold border border-gray-200">
              No announcements found for category '{filter}'.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNotifications.map((item) => {
                const dateStr = item.createdAt || item.date;
                const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }) : "Recent";

                return (
                  <div
                    key={item._id || item.id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100 relative overflow-hidden"
                  >
                    {item.priority === "urgent" && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
                    )}
                    {item.priority === "high" && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                    )}

                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {item.category || "Academic"}
                        </span>
                        {item.priority === "urgent" && (
                          <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse">
                            ⚠️ URGENT
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-medium text-gray-400">
                        🗓️ {formattedDate}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2.5 flex items-center gap-3 flex-wrap">
                      {item.title}
                      {item.isNew && (
                        <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                          NEW
                        </span>
                      )}
                    </h2>

                    <p className="text-gray-600 mb-4 whitespace-pre-line leading-relaxed text-sm">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs flex-wrap gap-2">
                      <div className="text-gray-400 font-medium">
                        Posted by: <strong className="text-gray-700">{item.createdBy || "Office of Academic Affairs"}</strong>
                      </div>

                      {item.attachment && (
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
                        >
                          View Attachment & Direct Link →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}