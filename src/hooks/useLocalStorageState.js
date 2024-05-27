import { useState, useEffect } from "react";

export function useLoacalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storeData = localStorage.getItem(key);
    return storeData ? JSON.parse(storeData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
