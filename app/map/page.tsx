import Map from "../../components/Map";

const LoveMapPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full h-full max-w-6xl p-6 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">Our Love Map ❤️</h1>
        <p className="text-gray-700 text-center mb-4">Click on the markers to see our special memories.</p>
        <div className="w-full h-[85%]">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default LoveMapPage;