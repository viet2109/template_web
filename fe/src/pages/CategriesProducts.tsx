import React, { useState } from 'react';
import FilterSidebar from '../components/categoriesComponent/FilterSidebar.tsx';
import SortControl from '../components/categoriesComponent/SortControl.tsx';
import ProductGrid from '../components/categoriesComponent/ProductGrid.tsx';

function CategoriesProducts() {
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [sort, setSort] = useState('popular');

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} />
            <main className="flex-1">
                <SortControl sort={sort} setSort={setSort} />
                <ProductGrid />
            </main>
        </div>
    );
}

export default CategoriesProducts;
