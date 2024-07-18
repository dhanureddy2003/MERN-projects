import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BooksData from "../../public/list.json";
import Card from "./Card";

function Responsive() {
  const category = BooksData.map((book) => book.category);
  const uniqueCategories = [...new Set(category)];
  console.log(uniqueCategories);
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-[75vw] my-5 mx-auto">
      <Slider {...settings}>
        {uniqueCategories.map((category) =>
          BooksData.filter((items) => items.category === category).map(
            (item) => <Card key={item.id} item={item} />
          )
        )}
      </Slider>
    </div>
  );
}

export default Responsive;
