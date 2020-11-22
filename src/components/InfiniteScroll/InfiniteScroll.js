import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./InfiniteScroll.css";

const InfiniteScroll = () => {
  const [element, setElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const page = useRef(1);
  const prevY = useRef(0);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y) {
          setTimeout(() => loadMore(), 1000);
        }
        prevY.current = y; // update the current position
      },
      { threshold: 0.25 }
    )
  );

  const fetchData = useCallback(async (pageNumber) => {
    const url = `https://picsum.photos/v2/list?page=${pageNumber}&limit=15`;
    setLoading(true);

    try {
      const res = await axios.get(url);
      const { status, data } = res;

      setLoading(false);
      return { status, data };
    } catch (e) {
      setLoading(false);
      return e;
    }
  }, []);

  const handleInitial = useCallback(
    async (page) => {
      const newImages = await fetchData(page);
      const { status, data } = newImages;
      if (status === 200) setImages((images) => [...images, ...data]);
    },
    [fetchData]
  );

  const loadMore = () => {
    page.current++;
    handleInitial(page.current);
  };

  useEffect(() => {
    handleInitial(page.current);
  }, [handleInitial]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <div>
      <p className="infinite-scroll">Infinite Scroll</p>

      <div className="infiniteScroll">
        {images &&
          images.map((image, index) => (
            <div key={index}>
              <img
                src={image.download_url}
                alt={image.author}
                className="imageStyle"
              />
            </div>
          ))}

        {loading && (
          <div className="loadingSpinner">
            <p>Spinner....!</p>
          </div>
        )}

        <div ref={setElement} className="buttonContainer">
          <button className="buttonStyle" onClick={loadMore}>
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;
