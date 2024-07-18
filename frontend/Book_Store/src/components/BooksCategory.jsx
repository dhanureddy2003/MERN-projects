import Responsive from './ResponsiveSlider'
function BooksCategory() {
  return (
    <>
      <div className="w-[80vw] my-0 mx-auto overflow-hidden">
        <h1 className="font-bold text-black text-2xl">Trending Books</h1>
        <p className="text-slate-800">
          Dive into the world of the most sought-after books. From gripping
          novels to enlightening non-fiction, find your next favorite read here.
          Stay ahead of the literary curve with the latest bestsellers and
          beloved classics.
        </p>
        <Responsive/>
      </div>
    </>
  )
}

export default BooksCategory

