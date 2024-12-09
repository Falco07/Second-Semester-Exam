

function SearchFilter({ searchTerm, onSearch }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={searchTerm}
        placeholder="Search repositories..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ padding: "8px", width: "100%", maxWidth: "400px", fontSize: "16px" }}
      />
    </div>
  );
}

export default SearchFilter;
