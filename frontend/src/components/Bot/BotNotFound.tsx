export default function BotNotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-5 bg-gray-50 p-2 py-5">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        alt="Bot Not Found"
        style={{ width: "120px", height: "120px", opacity: 0.7 }}
      />
      <div className="flex items-center">
        <h2>You don't have a bot, let's </h2>
        <button className="ml-1 rounded-md bg-green-600 p-2 py-1 font-[500] text-white hover:bg-green-500">
          Create a bot
        </button>
      </div>
    </div>
  );
}
