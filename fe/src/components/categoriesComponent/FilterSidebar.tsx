import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface FilterSidebarProps {
    priceRange: number[];
    setPriceRange: (value: number[]) => void;
}

const topics = [
    'Doanh nghiệp',
    'Cá nhân',
    'Landing Page',
    'Thương mại điện tử',
    'Blog',
    'Portfolio'
];

const frameworks = ['HTML/CSS', 'React', 'Vue', 'Angular', 'Next.js'];

const features = ['Responsive', 'Đa ngôn ngữ', 'SEO tốt', 'Tối ưu tốc độ', 'Dark Mode'];

const colorSpaces = ['RGB', 'CMYK'];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ priceRange, setPriceRange }) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedColorSpaces, setSelectedColorSpaces] = useState<string[]>([]);

    const handleChange = (
        value: string,
        selectedList: string[],
        setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setSelectedList((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setPriceRange(newValue);
        }
    };

    return (
        <aside className="w-full md:w-1/5 space-y-6 p-4">
            {/* Bộ lọc giá */}
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Giá
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={3000000}
                    step={200000}
                />
                <Typography variant="body2" color="text.secondary">
                    {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
                </Typography>
            </Box>

            {/* Chủ đề */}
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Chủ đề
                </Typography>
                {topics.map((topic) => (
                    <Box key={topic} sx={{ mb: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedTopics.includes(topic)}
                                    onChange={() => handleChange(topic, selectedTopics, setSelectedTopics)}
                                />
                            }
                            label={topic}
                        />
                    </Box>
                ))}
            </Box>

            {/* Framework/Ngôn ngữ */}
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Công nghệ sử dụng
                </Typography>
                {frameworks.map((fw) => (
                    <Box key={fw} sx={{ mb: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedFrameworks.includes(fw)}
                                    onChange={() => handleChange(fw, selectedFrameworks, setSelectedFrameworks)}
                                />
                            }
                            label={fw}
                        />
                    </Box>
                ))}
            </Box>

            {/* Tính năng */}
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Tính năng
                </Typography>
                {features.map((feature) => (
                    <Box key={feature} sx={{ mb: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedFeatures.includes(feature)}
                                    onChange={() => handleChange(feature, selectedFeatures, setSelectedFeatures)}
                                />
                            }
                            label={feature}
                        />
                    </Box>
                ))}
            </Box>

            {/* Không gian màu */}
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Không gian màu
                </Typography>
                {colorSpaces.map((space) => (
                    <Box key={space} sx={{ mb: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedColorSpaces.includes(space)}
                                    onChange={() => handleChange(space, selectedColorSpaces, setSelectedColorSpaces)}
                                />
                            }
                            label={space}
                        />
                    </Box>
                ))}
            </Box>
        </aside>
    );
};

export default FilterSidebar;
