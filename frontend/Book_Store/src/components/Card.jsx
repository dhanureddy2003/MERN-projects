/* eslint-disable react/prop-types */

function Card( {item}) {
  return (
    <>
      <div className="card bg-base-100 w-[80%] h-[60vh] shadow-xl">
        <figure>
          <img
          className="bg-cover w-full h-[200px]"
            src={item.imglink}
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {item.name}
          </h2>
          {/* <p>{item.desc}</p> */}
          <div className="card-actions justify-end">
            <div className="badge badge-outline">{item.category}</div>
            <div className="badge badge-outline">$ {item.price}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
