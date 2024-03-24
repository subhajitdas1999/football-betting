export const MatchCardPlaceholder = () => {
  return (
    <div className="animate-pulse p-4 rounded-lg border border-gray-300 transform transition-all hover:scale-105 w-1/2 mx-auto">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <div className=" w-32 h-32 rounded-full bg-gray-300"></div>
            <div className=" h-8 bg-gray-300 rounded mt-4 w-24"></div>
          </div>

          <span className="text-2xl font-bold">vs</span>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
            <div className="h-8 bg-gray-300 rounded mt-4 w-24"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-300 rounded mt-8 w-32"></div>
      </div>
    </div>
  );
};
