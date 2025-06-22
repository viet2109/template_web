import React, { useState } from "react";
import {
  FiCode,
  FiDownload,
  FiEdit3,
  FiEye,
  FiFilter,
  FiGrid,
  FiList,
  FiPackage,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  thumbnail: string;
  tags: string[];
  status: "active" | "inactive" | "pending";
  createdAt: string;
  author: string;
  type: "free" | "premium";
  featured: boolean;
}

const AdminTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Modern Portfolio Template",
      description:
        "Template hiện đại cho trang portfolio cá nhân với animation mượt mà và responsive design",
      category: "Portfolio",
      price: 299000,
      rating: 4.8,
      downloads: 1250,
      thumbnail:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop&crop=entropy&auto=format",
      tags: ["React", "Modern", "Animation", "Responsive"],
      status: "active",
      createdAt: "2024-01-15",
      author: "John Doe",
      type: "premium",
      featured: true,
    },
    {
      id: "2",
      name: "E-commerce Landing Page",
      description:
        "Template trang đích cho website bán hàng với tích hợp thanh toán và UI hiện đại",
      category: "E-commerce",
      price: 0,
      rating: 4.5,
      downloads: 890,
      thumbnail:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=entropy&auto=format",
      tags: ["E-commerce", "Landing", "Free", "Payment"],
      status: "active",
      createdAt: "2024-01-10",
      author: "Jane Smith",
      type: "free",
      featured: false,
    },
    {
      id: "3",
      name: "Corporate Website",
      description:
        "Template doanh nghiệp chuyên nghiệp với nhiều trang và component đa dạng",
      category: "Corporate",
      price: 599000,
      rating: 4.9,
      downloads: 2100,
      thumbnail:
        "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7c9?w=400&h=300&fit=crop&crop=entropy&auto=format",
      tags: ["Corporate", "Business", "Multi-page", "Professional"],
      status: "inactive",
      createdAt: "2024-01-05",
      author: "Mike Johnson",
      type: "premium",
      featured: true,
    },
    {
      id: "4",
      name: "Blog Template",
      description:
        "Template blog cá nhân với thiết kế tối giản và tập trung vào nội dung",
      category: "Blog",
      price: 199000,
      rating: 4.6,
      downloads: 750,
      thumbnail:
        "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7c9?w=400&h=300&fit=crop&crop=entropy&auto=format",
      tags: ["Blog", "Minimal", "Content-focused"],
      status: "pending",
      createdAt: "2024-01-20",
      author: "Sarah Wilson",
      type: "premium",
      featured: false,
    },
  ]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form state for Add/Edit modal
  const [formData, setFormData] = useState<Partial<Template>>({
    name: "",
    description: "",
    category: "Portfolio",
    price: 0,
    thumbnail: "",
    tags: [],
    status: "pending",
    author: "",
    type: "free",
    featured: false,
  });

  const categories = [
    "Portfolio",
    "E-commerce",
    "Corporate",
    "Blog",
    "Landing",
  ];
  const statuses = ["active", "inactive", "pending"];
  const types = ["free", "premium"];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || template.status === selectedStatus;
    const matchesType =
      selectedType === "all" || template.type === selectedType;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setFormData({
      name: "",
      description: "",
      category: "Portfolio",
      price: 0,
      thumbnail: "",
      tags: [],
      status: "pending",
      author: "",
      type: "free",
      featured: false,
    });
    setShowAddModal(true);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormData(template);
    setShowEditModal(true);
  };

  const handleDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      // Edit existing template
      setTemplates(
        templates.map((t) =>
          t.id === selectedTemplate.id
            ? ({ ...formData, id: selectedTemplate.id } as Template)
            : t
        )
      );
      setShowEditModal(false);
    } else {
      // Add new template
      const newTemplate: Template = {
        ...(formData as Template),
        id: Date.now().toString(),
        rating: 0,
        downloads: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTemplates([...templates, newTemplate]);
      setShowAddModal(false);
    }
    setFormData({});
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setShowDeleteModal(false);
      setSelectedTemplate(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFeatured = (id: string) => {
    setTemplates(
      templates.map((template) =>
        template.id === id
          ? { ...template, featured: !template.featured }
          : template
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Miễn phí" : `${price.toLocaleString("vi-VN")}đ`;
  };

  const handleFormChange = (field: keyof Template, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  // Stats calculations
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.status === "active").length;
  const totalDownloads = templates.reduce((sum, t) => sum + t.downloads, 0);
  const averageRating =
    templates.reduce((sum, t) => sum + t.rating, 0) / templates.length;

  return (
    <div className="min-h-screen my-6 px-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-full">
        {/* Header with Stats */}
        <div className="bg-white/80 rounded-tl-xl rounded-tr-xl backdrop-blur-sm shadow-sm border-b border-gray-200/50 px-4 lg:px-6 py-6">
          <div className="flex flex-col gap-6">
            {/* Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Quản Lý Template
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Quản lý các template website của bạn một cách hiệu quả
                </p>
              </div>
              <button
                onClick={handleAddTemplate}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <FiPlus className="w-5 h-5" />
                <span className="whitespace-nowrap">Thêm Template</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Tổng Template
                    </p>
                    <p className="text-xl font-bold text-blue-900">
                      {totalTemplates}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl border border-emerald-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">
                      Đang Hoạt Động
                    </p>
                    <p className="text-xl font-bold text-emerald-900">
                      {activeTemplates}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FiDownload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Tổng Lượt Tải
                    </p>
                    <p className="text-xl font-bold text-purple-900">
                      {totalDownloads.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-xl border border-amber-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <FiStar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600 font-medium">
                      Đánh Giá TB
                    </p>
                    <p className="text-xl font-bold text-amber-900">
                      {averageRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 px-4 lg:px-6 py-4">
          <div className="space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm template theo tên, mô tả hoặc tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm lg:text-base"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                    showFilters
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Bộ lọc</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300/60 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "active"
                        ? "Hoạt động"
                        : status === "inactive"
                        ? "Không hoạt động"
                        : "Chờ duyệt"}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                >
                  <option value="all">Tất cả loại</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "free" ? "Miễn phí" : "Trả phí"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="py-4 lg:py-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCode className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy template
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm, hoặc thêm template
                mới
              </p>
              <button
                onClick={handleAddTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Thêm Template Đầu Tiên
              </button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 group transform hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="p-2 bg-white/90 backdrop-blur rounded-full text-gray-700 hover:bg-white transition-colors shadow-lg"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white/90 backdrop-blur rounded-full text-gray-700 hover:bg-white transition-colors shadow-lg">
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template)}
                              className="p-2 bg-white/90 backdrop-blur rounded-full text-red-600 hover:bg-white transition-colors shadow-lg"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {template.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                              <FiStar className="w-3 h-3" />
                              Nổi bật
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              template.status
                            )} backdrop-blur-sm`}
                          >
                            {template.status === "active"
                              ? "Hoạt động"
                              : template.status === "inactive"
                              ? "Tạm dừng"
                              : "Chờ duyệt"}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 flex-1">
                            {template.name}
                          </h3>
                          <button
                            onClick={() => toggleFeatured(template.id)}
                            className={`ml-2 flex-shrink-0 transition-colors ${
                              template.featured
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-gray-400 hover:text-amber-500"
                            }`}
                          >
                            <FiStar className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(template.price)}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FiStar className="w-4 h-4 text-amber-500" />
                            <span className="font-medium">
                              {template.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <FiDownload className="w-4 h-4" />
                            {template.downloads.toLocaleString()}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                            {template.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-xs">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
                  {/* Mobile List View */}
                  <div className="block lg:hidden">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="border-b border-gray-200/50 p-4 last:border-b-0"
                      >
                        <div className="flex gap-4">
                          <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-20 h-16 object-cover rounded-xl flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">
                                {template.name}
                              </h3>
                              {template.featured && (
                                <FiStar className="w-4 h-4 text-amber-500 ml-2 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                              {template.description}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-blue-600">
                                {formatPrice(template.price)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  template.status
                                )}`}
                              >
                                {template.status === "active"
                                  ? "Hoạt động"
                                  : template.status === "inactive"
                                  ? "Tạm dừng"
                                  : "Chờ duyệt"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FiStar className="w-3 h-3 text-amber-500" />
                                  {template.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiDownload className="w-3 h-3" />
                                  {template.downloads.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleFeatured(template.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    template.featured
                                      ? "text-amber-500 bg-amber-50"
                                      : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                                  }`}
                                >
                                  <FiStar className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditTemplate(template)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                >
                                  <FiEdit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80 border-b border-gray-200/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Template
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Danh mục
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Giá
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Đánh giá
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Lượt tải
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Trạng thái
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 text-sm">
                            Tác giả
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900 text-sm">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50">
                        {filteredTemplates.map((template) => (
                          <tr
                            key={template.id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={template.thumbnail}
                                  alt={template.name}
                                  className="w-16 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                      {template.name}
                                    </h3>
                                    {template.featured && (
                                      <FiStar className="w-4 h-4 text-amber-500" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-1 max-w-xs">
                                    {template.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {template.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-blue-600 text-sm">
                                {formatPrice(template.price)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <FiStar className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium">
                                  {template.rating}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-600">
                                {template.downloads.toLocaleString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  template.status
                                )}`}
                              >
                                {template.status === "active"
                                  ? "Hoạt động"
                                  : template.status === "inactive"
                                  ? "Tạm dừng"
                                  : "Chờ duyệt"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-600">
                                {template.author}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => toggleFeatured(template.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    template.featured
                                      ? "text-amber-500 bg-amber-50"
                                      : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                                  }`}
                                  title={
                                    template.featured
                                      ? "Bỏ nổi bật"
                                      : "Đặt nổi bật"
                                  }
                                >
                                  <FiStar className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Xem trước"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditTemplate(template)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <FiEdit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Xóa"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Thêm Template Mới
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Template *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên template..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category || "Portfolio"}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Mô tả chi tiết về template..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) =>
                      handleFormChange("price", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 = Miễn phí"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại Template
                  </label>
                  <select
                    value={formData.type || "free"}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="free">Miễn phí</option>
                    <option value="premium">Trả phí</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tác giả *
                  </label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => handleFormChange("author", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên tác giả..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status || "pending"}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình ảnh thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.thumbnail && (
                  <div className="mt-4">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Modern, Responsive, Animation"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) =>
                    handleFormChange("featured", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-semibold text-gray-700"
                >
                  Đánh dấu là template nổi bật
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Thêm Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chỉnh sửa Template
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Template *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên template..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category || "Portfolio"}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Mô tả chi tiết về template..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) =>
                      handleFormChange("price", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 = Miễn phí"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại Template
                  </label>
                  <select
                    value={formData.type || "free"}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="free">Miễn phí</option>
                    <option value="premium">Trả phí</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tác giả *
                  </label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => handleFormChange("author", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên tác giả..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status || "pending"}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình ảnh thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.thumbnail && (
                  <div className="mt-4">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-300"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Modern, Responsive, Animation"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured-edit"
                  checked={formData.featured || false}
                  onChange={(e) =>
                    handleFormChange("featured", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="featured-edit"
                  className="text-sm font-semibold text-gray-700"
                >
                  Đánh dấu là template nổi bật
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa template "{selectedTemplate.name}"?
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplate;

