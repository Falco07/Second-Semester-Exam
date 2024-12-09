import { useEffect, useState } from "react";
import axios from "axios";
import SearchFilter from "./SearchFilter";

const PER_PAGE = 10;

function RepoList({ username }) {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          params: { per_page: 100 },
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN || ""}`, // Optional
          },
        }
      );
      setRepos(response.data);
      setFilteredRepos(response.data);
    } catch (err) {
      setError("Failed to fetch repositories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  // Handle search and filtering
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = repos.filter((repo) =>
      repo.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRepos(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRepos.length / PER_PAGE);
  const displayedRepos = filteredRepos.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div>
      <SearchFilter searchTerm={searchTerm} onSearch={handleSearch} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <ul>
            {displayedRepos.map((repo) => (
              <li key={repo.id}>
                <h2>{repo.name}</h2>
                <p>{repo.description || "No description provided."}</p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Repository
                </a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default RepoList;
