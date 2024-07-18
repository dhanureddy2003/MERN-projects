import BookImg from '../assets/BookImg.png'
function Banner() {
  return (
    <>
      <div className="w-[80vw] bg-white text-black flex justify-between my-0 mx-auto py-5">
        <div className="text-left w-[50%] font-medium leading-8 text-xl flex justify-center flex-col align-middle">
          <h2 className="mb-4">
            Explore a world of imagination with our vast collection of books
            across all genres. From timeless classics to the latest bestsellers,
            there a perfect story waiting just for you.{" "}
            <span className="text-pink-700">
              Visit us today and dive into your next literary adventure!
            </span>
          </h2>
          <input type="text" placeholder="Email" className="bg-white outline-none border-gray-400 border-[1px] border-solid pl-2 text-slate-800 text-sm w-[250px] h-[2rem] rounded-md" />
        </div>
        <div className="w-[50%]">
            <img className='w-[30rem] h-[27rem] my-0 mx-auto' src={BookImg} alt="" />
        </div>
      </div>
    </>
  );
}

export default Banner;
