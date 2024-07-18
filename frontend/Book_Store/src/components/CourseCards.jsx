import BooksData from "../../public/list.json";
import Card from "./Card";

function CourseCards() {
  const fantasy = BooksData.filter((item) => item.category === "Fantasy");
  const classic = BooksData.filter((item) => item.category === "Classic");
  const adventure = BooksData.filter((item) => item.category === "Adventure");
  const historical = BooksData.filter((item) => item.category === "Historical");
  return (
    <>
    <div>
      <div className="w-[80vw] my-5 mx-auto flex align-middle space-x-2">
        {fantasy.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      <div className="w-[80vw] z-0 my-5 mx-auto flex align-middle space-x-2">
        {classic.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      <div className="w-[80vw] z-0 my-5 mx-auto flex align-middle space-x-2">
        {adventure.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      <div className="w-[80vw] z-0 my-5 mx-auto flex align-middle space-x-2">
        {historical.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
    </>
  );
}

export default CourseCards;
