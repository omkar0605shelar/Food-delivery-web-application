import Nav from "./Nav";
import categories from "../category.js";
import { useRef, useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard.jsx";

function UserDashBoard() {
  const { currentCity, shopInMyCity, itemsInMyCity } = useSelector(
    (state) => state.user
  );

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const itemsScrollRef = useRef();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const [showLeftItemsButton, setShowLeftItemsButton] = useState(false);
  const [showRightItemsButton, setShowRightItemsButton] = useState(false);

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  useEffect(() => {
    if (
      !cateScrollRef.current ||
      !shopScrollRef.current ||
      !itemsScrollRef.current
    )
      return;

    const handleCateScroll = () => {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );
    };

    const handleShopScroll = () => {
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );
    };

    const handleItemsScroll = () => {
      updateButton(
        shopScrollRef,
        setShowLeftItemsButton,
        setShowRightItemsButton
      );
    };

    handleCateScroll();
    handleShopScroll();
    handleItemsScroll();

    cateScrollRef.current.addEventListener("scroll", handleCateScroll);
    shopScrollRef.current.addEventListener("scroll", handleShopScroll);
    itemsScrollRef.current.addEventListener("scroll", handleItemsScroll);

    return () => {
      if (cateScrollRef.current) {
        cateScrollRef.current.removeEventListener("scroll", handleCateScroll);
      }
      if (shopScrollRef.current) {
        shopScrollRef.current.removeEventListener("scroll", handleShopScroll);
      }
      if (itemsScrollRef.current) {
        itemsScrollRef.current.removeEventListener("scroll", handleItemsScroll);
      }
    };
  }, []);

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />

      {/* Category Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#ff4d2d] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft size={20} />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
              />
            ))}
          </div>

          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#ff4d2d] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Shops Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {currentCity}
        </h1>

        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#ff4d2d] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaChevronCircleLeft size={20} />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={shopScrollRef}
          >
            {(shopInMyCity || []).map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#ff4d2d] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>

        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {itemsInMyCity?.map((item, index) => {
            return <FoodCard key={index} data={item} />
          })}
        </div>
      </div>
    </div>
  );
}

export default UserDashBoard;
