import React from "react";

function Materials({ subjects, sem }) {
  const allsubs = [
    ...subjects["previous_papers"],
    ...subjects["units"],
    ...subjects["textbooks"],
  ];
  console.log(allsubs);
  return (
    <div>
      <section
        id="years"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {subjects.subject_name}
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your Subject materials instantly from below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-9">
            {allsubs.map((item, index) => {
              const colors = [
                "from-blue-500 to-purple-500",
                "from-green-500 to-teal-500",
                "from-orange-500 to-red-500",
                "from-indigo-500 to-pink-500",
              ];

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                        {sem}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 mb-4">
                      Get your {item.description} Materials Here
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        className={`w-full px-6 py-2 bg-gradient-to-r ${colors[index % 4]} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                        onClick={() =>
                          item.link !== ""
                            ? window.open(item.link, "_blank")
                            : alert("Not available this time")
                        }
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Materials;
