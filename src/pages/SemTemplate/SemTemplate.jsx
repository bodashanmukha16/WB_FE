import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
// import { useNavigate } from "react-router-dom";
import subjectList from "../../Data/subject_list.json";
import SubjectMapping from "../../Data/subjects_mapping.json";
import { useParams } from "react-router-dom";
import Materials from "../../components/sections/Materials";

function SemTemplate() {
  // const navigate = useNavigate()
  const { regulation, branch, year, sem } = useParams();
  const fullURL = `${regulation}/${branch}/${year}/${sem}`;
  let FullSubjectData = [];
  const matchedObj = SubjectMapping.find((obj) => obj[fullURL]);

if (!matchedObj) {
  console.error(`No mapping found for: ${fullURL}`);
  return; // or return some fallback UI
}

const SubjectMappingResult = matchedObj[fullURL].subjects_included;
  //   console.log(SubjectMappingResult)
  SubjectMappingResult.forEach((element) => {
    let subject = subjectList.find((obj) => obj[element])[element];
    subject && FullSubjectData.push(subject);
  });
  // console.log(FullSubjectData);
  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <section className="pt-32 pb-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Academic <span className="text-yellow-300">Materials Hub</span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Access semester-wise notes, previous papers, lab manuals and
              important questions — organized perfectly for your academic
              success.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("years")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-white text-purple-700 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Explore Materials
            </button>
          </div>

          {/* Background Overlay Shape */}
          <div className="absolute -bottom-10 left-0 w-full h-22 bg-white rounded-t-[60px]"></div>
        </section>
        {/* ATTRACTIVE SECOND SECTION */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Below is Your Current Semester Subjects
            </h2>
            <div className="grid md:grid-cols-4 gap-10 mt-12">
              {SubjectMappingResult &&
                SubjectMappingResult.map((sub, ind) => (
                  <div
                    className="p-6 rounded-2xl bg-blue-50 hover:shadow-lg transition"
                    key={ind}
                  >
                    <div className="text-4xl mb-4">📘</div>
                    <h3 className="font-semibold text-xl mb-2">{sub}</h3>
                    <p className="text-gray-600">
                      {FullSubjectData[ind].subject_name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* YEAR CARDS SECTION */}
        {FullSubjectData &&
          FullSubjectData.map((subject, ind) => (
            <Materials key={ind} subjects={subject} sem={sem} />
          ))}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default SemTemplate;
