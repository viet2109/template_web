import React from 'react';

interface SortControlProps {
    sort: string;
    setSort: (value: string) => void;
}

const SortControl: React.FC<SortControlProps> = ({ sort, setSort }) => {
    return (
        <div className="flex justify-end mb-4">
            <label htmlFor="sort" className="mr-2 font-medium text-gray-700">Sắp xếp theo</label>
            <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
            >
                <option value="popular">Phổ biến</option>
                <option value="new">Mới</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="high-low">Giá cao-thấp</option>
                <option value="low-high">Giá thấp-cao</option>
            </select>
        </div>
    );
};

export default SortControl;
