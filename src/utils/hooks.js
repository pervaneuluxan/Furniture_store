import { useEffect, useState } from 'react';

/**
 * Runs `load` (a function returning an axios promise) whenever `deps` change and
 * tracks its state. Responses that arrive after the deps changed are ignored.
 * `notFound` is true when the API answered 404.
 */
export function useApi(load, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null, notFound: false });

  useEffect(() => {
    let current = true;
    setState((s) => ({ ...s, loading: true, error: null, notFound: false }));

    load()
      .then((res) => current && setState({ data: res.data, loading: false, error: null, notFound: false }))
      .catch((error) => {
        if (!current) return;
        setState({
          data: null,
          loading: false,
          error,
          notFound: error?.response?.status === 404,
        });
      });

    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Depot` : 'Depot';
  }, [title]);
}
