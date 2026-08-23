import { Filter, RotateCcw, Search } from "lucide-react";

import "./InventoryFilters.css";

const InventoryFilters = ({
    search = "",
    status = "all",
    onSearchChange,
    onStatusChange,
    onReset,
}) => {
    return (
        <div className="inventory-filters">
            <div className="inventory-filters__heading">
                <Filter size={15} strokeWidth={1.8} />

                <span>Filter Inventory</span>
            </div>

            <div className="inventory-filters__controls">
                <div className="inventory-filters__search">
                    <Search
                        size={15}
                        strokeWidth={1.8}
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            onSearchChange?.(
                                event.target.value
                            )
                        }
                        placeholder="Search product or SKU..."
                        aria-label="Search inventory"
                    />
                </div>

                <select
                    className="inventory-filters__status"
                    value={status}
                    onChange={(event) =>
                        onStatusChange?.(
                            event.target.value
                        )
                    }
                    aria-label="Filter inventory by status"
                >
                    <option value="all">
                        All Status
                    </option>

                    <option value="in-stock">
                        In Stock
                    </option>

                    <option value="low-stock">
                        Low Stock
                    </option>

                    <option value="out-of-stock">
                        Out of Stock
                    </option>
                </select>

                <button
                    type="button"
                    className="inventory-filters__reset"
                    onClick={onReset}
                    title="Reset filters"
                    aria-label="Reset inventory filters"
                >
                    <RotateCcw
                        size={14}
                        strokeWidth={1.8}
                    />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default InventoryFilters;