import { useEffect, useRef } from "react";

function useSyncedRef(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

export default useSyncedRef;
