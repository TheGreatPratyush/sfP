import { Search, X } from "lucide-react";

import "./SearchBar.css";

const SearchBar = ({
    value = "",
    onChange,
    placeholder = "Search...",
}) => {
    const handleClear = () => {
        onChange?.("");
    };

    return (
        <div className="owner-search-bar">
            <Search
                className="owner-search-bar__icon"
                size={16}
                strokeWidth={1.8}
            />

            <input
                type="search"
                className="owner-search-bar__input"
                value={value}
                onChange={(event) =>
                    onChange?.(event.target.value)
                }
                placeholder={placeholder}
                aria-label={placeholder}
            />

            {value && (
                <button
                    type="button"
                    className="owner-search-bar__clear"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <X size={14} strokeWidth={1.8} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;