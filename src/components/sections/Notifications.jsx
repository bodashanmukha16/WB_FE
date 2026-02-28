import { useState } from "react";
import notificationsData from "../../Data/university_notifications.json";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

export default function Notifications() {
  const [notifications] = useState(notificationsData);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(notifications.map(n => n.category))];

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(n => n.category === filter);

  return (
<>
<Header></Header>
<section className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            University News & Updates
          </h1>
          <p className="text-gray-600 mt-3">
            Stay updated with latest announcements, exams, results and events
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full border transition ${
                filter === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-6">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-blue-600">
                  {item.category}
                </span>

                <span className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                {item.title}
                {item.isNew && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
              </h2>

              <p className="text-gray-600 mb-4">
                {item.description}
              </p>

              {item.attachment && (
                <a
                  href={item.attachment}
                  className="inline-flex items-center text-blue-600 font-medium hover:underline"
                >
                  View Attachment →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer></Footer>
    </>
  );
}