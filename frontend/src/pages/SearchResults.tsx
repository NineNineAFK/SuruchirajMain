// src/pages/SearchResults.tsx
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { searchQueryAtom } from '../state/state';
import { searchProducts } from '../api/searchProducts';

const SearchResults = () => {
  const query = useRecoilValue(searchQueryAtom);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    searchProducts(query)
      .then((res) => {
        setResults(res);
      })
      .catch((err) => {
        console.error('Search error:', err);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Results for “{query}”</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item: any) => (
            <li key={item._id} className="border p-2 rounded-lg">
              <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded" />
              <p className="mt-2 text-center font-medium">{item.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
