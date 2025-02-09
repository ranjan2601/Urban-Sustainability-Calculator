"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";

const DynamicMap = dynamic(() => import("./components/map"), { ssr: false });

export default function Home() {
  const [sustainabilityData, setSustainabilityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState("");
  const [constructionType, setConstructionType] = useState("");

  // Function to calculate sustainability score
  // Function to calculate sustainability score
  const calculateSustainability = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project.trim() || !constructionType) {
      alert("Please fill in all fields before assessing sustainability.");
      return;
    }

    if (!sustainabilityData?.location?.latitude || !sustainabilityData?.location?.longitude) {
      alert("Please select a location on the map first.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        construction_plans: `Project: ${project}, Construction Type: ${constructionType}`, // Combine project and constructionType into construction_plans
        latitude: sustainabilityData.location.latitude,
        longitude: sustainabilityData.location.longitude,
      };
      console.log("Payload:", payload);

      const response = await fetch("http://127.0.0.1:5000/construction_json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error || "Failed to calculate sustainability score. Try Again.");
      }
      setSustainabilityData({
        ...data,
        location: sustainabilityData.location,
      });
    } catch (error) {
      console.error("Error calculating sustainability:", error);
      alert(error instanceof Error ? error.message : "Failed to fetch sustainability data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-opacity-50"></div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <Head>
        <title>Sustainability Map</title>
        <meta name="description" content="Explore sustainable spots in your area!" />
      </Head>

      {/* Header */}
      <header className="py-4 text-center bg-green-100 rounded-b-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2">
          <span className="animate-spin-slow">🌱</span>
          Go Green or Cry
          <span>🌳😭</span>
        </h1>
        <p className="text-sm text-green-600 mt-1">Build Sustainably. 🌍✨</p>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section (2/3 width) */}
        <div className="w-2/3 h-full">
          <DynamicMap
            onDataFetch={(data: any) => {
              console.log("Data from backend:", data);
              setSustainabilityData(data);
            }}
          />
        </div>

        {/* Sidebar Section (1/3 width) */}
        <div className="w-1/3 h-full border-l border-gray-200 flex flex-col">
          {/* Fixed Header Section */}
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold text-green-600 mb-4 text-center">
              Plan Your Sustainable Construction 🌍
            </h2>
            <form className="space-y-4" onSubmit={calculateSustainability}>
              <div>
                <label htmlFor="project" className="block text-sm text-gray-700 mb-1">
                  What do you want to build?
                </label>
                <input
                  type="text"
                  id="project"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="E.g., eco-friendly office, solar-powered home"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
                  disabled={!sustainabilityData?.location?.latitude}
                />
                <p className="text-xs text-gray-500 mt-1"> Select a location on the map first. </p>
              </div>

              <div>
                <label htmlFor="constructionType" className="block text-sm text-gray-700 mb-1">
                  Type of Construction
                </label>
                <select
                  id="constructionType"
                  value={constructionType}
                  onChange={(e) => setConstructionType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
                  disabled={isLoading}
                >
                  <option value="">Select a type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="public">Public Infrastructure</option>
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-2 rounded transition flex justify-center items-center ${isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Calculating...
                  </>
                ) : (
                  "Assess Sustainability"
                )}
              </button>
            </form>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Selected Location Details */}
            <div className="bg-green-100 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold text-green-700 mb-2">📍 Selected Location</h3>
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {sustainabilityData?.location?.address ?? "Click on the map"} <br />
                <strong>Latitude:</strong> {sustainabilityData?.location?.latitude?.toFixed(5) ?? "--"},{" "}
                <strong>Longitude:</strong> {sustainabilityData?.location?.longitude?.toFixed(5) ?? "--"}
              </p>
            </div>

            {/* Sustainability Score */}
            <div className="bg-gray-100 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold text-green-700 mb-2">🌿 Sustainability Score</h3>
              {isLoading ? <LoadingSpinner /> : (
                <p className="text-sm text-gray-700">
                  <strong>Zone:</strong> {sustainabilityData?.final_score?.zone ?? "N/A"} <br />
                  <strong>Final Score:</strong> {sustainabilityData?.final_score?.value ?? "--"} / 10
                </p>
              )}
            </div>

            {/* Economic Sustainability */}
            <div className="bg-blue-100 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold text-green-700 mb-2">🏙 Economic Sustainability</h3>
              {isLoading ? <LoadingSpinner /> : (<p className="text-sm text-gray-700">
                <strong>Affordability:</strong>{" "}
                {sustainabilityData?.sustainability_score?.economic_sustainability?.affordability_social_equity ?? "N/A"}
                <br />
                <strong>Infrastructure:</strong>{" "}
                {sustainabilityData?.sustainability_score?.economic_sustainability?.infrastructure_transport ?? "N/A"}
                <br />
                <strong>Job Market:</strong>{" "}
                {sustainabilityData?.sustainability_score?.economic_sustainability?.job_creation_local_economy ?? "N/A"}
              </p>)}
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-100 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold text-green-700 mb-2">🌍 Environmental Impact</h3>
              {isLoading ? <LoadingSpinner /> : (
              <p className="text-sm text-gray-700">
                <strong>Air & Water Quality:</strong>{" "}
                {sustainabilityData?.sustainability_score?.environmental_impact?.air_water_quality ?? "N/A"}
                <br />
                <strong>Carbon Footprint:</strong>{" "}
                {sustainabilityData?.sustainability_score?.environmental_impact?.carbon_footprint ?? "N/A"}
                <br />
                <strong>Green Space:</strong>{" "}
                {sustainabilityData?.sustainability_score?.environmental_impact?.green_space_biodiversity ?? "N/A"}
                <br />
                <strong>Waste Management:</strong>{" "}
                {sustainabilityData?.sustainability_score?.environmental_impact?.waste_circular_economy ?? "N/A"}
              </p>
              )}
            </div>

            {/* Social Impact */}
            <div className="bg-yellow-100 p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold text-green-700 mb-2">❤️ Social Impact</h3>
              {isLoading ? <LoadingSpinner /> : (
              <p className="text-sm text-gray-700">
                <strong>Well-being:</strong>{" "}
                {sustainabilityData?.sustainability_score?.social_impact?.community_well_being ?? "N/A"}
                <br />
                <strong>Health & Safety:</strong>{" "}
                {sustainabilityData?.sustainability_score?.social_impact?.health_safety ?? "N/A"}
                <br />
                <strong>Noise & Light:</strong>{" "}
                {sustainabilityData?.sustainability_score?.social_impact?.noise_light_pollution ?? "N/A"}
              </p>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold text-green-700 mb-2">💡 Recommendations</h3>
              {isLoading ? <LoadingSpinner /> : (
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {sustainabilityData?.final_score?.recommendations?.length > 0 ? (
                  sustainabilityData.final_score.recommendations.map(
                    (rec: string, index: number) => <li key={index}>{rec}</li>
                  )
                ) : (
                  <li>No recommendations available.</li>
                )}
              </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
