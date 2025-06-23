import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { 
  AdminTemplateDto, 
  TemplateStatus,
  Category,
} from "../types";
import { fetchAdminTemplate, GetTemplateParams } from "../api/adminTemplate";

const AdminTemplate: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<TemplateStatus | "all">("all");
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplateDto | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sellerName, setSellerName] = useState<string>("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Form state for Add/Edit modal
  const [formData, setFormData] = useState<Partial<AdminTemplateDto>>({
    name: "",
    description: "",
    category: Category.PORTFOLIO,
    price: 0,
    isFree: true,
    status: TemplateStatus.PENDING,
  });

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, selectedCategory, selectedStatus, isFreeFilter, minPrice, maxPrice, sellerName, pageSize]);

  // Build query parameters
  const queryParams = useMemo((): GetTemplateParams => ({
    page: currentPage,
    size: pageSize,
    keyword: debouncedSearchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    templateStatus: selectedStatus !== "all" ? selectedStatus : undefined,
    isFree: isFreeFilter !== "all" ? isFreeFilter : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sellerName: sellerName || undefined,
  }), [currentPage, pageSize, debouncedSearchTerm, selectedCategory, selectedStatus, isFreeFilter, minPrice, maxPrice, sellerName]);

  // Regular query instead of infinite query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-templates', queryParams],
    queryFn: () => fetchAdminTemplate(queryParams),
  });

  // Get templates from current page
  const templates = data?.content ?? [];
  const totalElements = data?.page.totalElements ?? 0;
  const totalPages = data?.page.totalPages ?? 0;

  // Stats calculations (based on current page data)
  const activeTemplates = templates.filter((t) => t.status === TemplateStatus.APPROVED).length;
  const totalDownloads = templates.reduce((sum, t) => sum + t.totalDownloads, 0);
  const averageRating = templates.length > 0 
    ? templates.reduce((sum, t) => sum + t.rating, 0) / templates.length 
    : 0;

  const categories = Object.values(Category);
  const statuses = Object.values(TemplateStatus);

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setFormData({
      name: "",
      description: "",
      category: Category.PORTFOLIO,
      price: 0,
      isFree: true,
      status: TemplateStatus.PENDING,
    });
    setShowAddModal(true);
  };

  const handleEditTemplate = (template: AdminTemplateDto) => {
    setSelectedTemplate(template);
    setFormData(template);
    setShowEditModal(true);
  };

  const handleDeleteTemplate = (template: AdminTemplateDto) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const handleSaveTemplate = () => {
    // TODO: Implement API calls for add/edit
    console.log("Save template:", formData);
    setShowAddModal(false);
    setShowEditModal(false);
    refetch();
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      // TODO: Implement delete API call
      console.log("Delete template:", selectedTemplate.id);
      setShowDeleteModal(false);
      setSelectedTemplate(null);
      refetch();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Handle file upload
      console.log("File selected:", file);
    }
  };

  const getStatusColor = (status: TemplateStatus) => {
    switch (status) {
      case TemplateStatus.APPROVED:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case TemplateStatus.REJECTED:
      case TemplateStatus.SUSPENDED:
        return "bg-red-50 text-red-700 border-red-200";
      case TemplateStatus.PENDING:
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: TemplateStatus) => {
    switch (status) {
      case TemplateStatus.APPROVED:
        return "Đã duyệt";
      case TemplateStatus.REJECTED:
        return "Bị từ chối";
      case TemplateStatus.SUSPENDED:
        return "Tạm dừng";
      case TemplateStatus.PENDING:
        return "Chờ duyệt";
      default:
        return status;
    }
  };

  const getCategoryText = (category: Category) => {
    const categoryMap = {
      [Category.LANDING_PAGE]: "Landing Page",
      [Category.E_COMMERCE]: "E-commerce",
      [Category.PORTFOLIO]: "Portfolio",
      [Category.BLOG]: "Blog",
      [Category.BUSINESS]: "Business",
      [Category.ADMIN_DASHBOARD]: "Admin Dashboard",
      [Category.CRM]: "CRM",
      [Category.CMS]: "CMS",
      [Category.OTHER]: "Khác",
    };
    return categoryMap[category] || category;
  };

  const formatPrice = (template: AdminTemplateDto) => {
    if (template.isFree) return "Miễn phí";
    if (template.discountPrice > 0) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-600">
            {template.discountPrice.toLocaleString("vi-VN")}đ
          </span>
          <span className="text-sm text-gray-500 line-through">
            {template.price.toLocaleString("vi-VN")}đ
          </span>
        </div>
      );
    }
    return `${template.price.toLocaleString("vi-VN")}đ`;
  };

  const handleFormChange = (field: keyof AdminTemplateDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || "Không thể tải dữ liệu template"}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
                      {totalElements.toLocaleString()}
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
                      Đã Duyệt (Trang này)
                    </p>
                    <p className="text-xl font-bold text-emerald-900">
                      {activeTemplates.toLocaleString()}
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
                      Lượt Tải (Trang này)
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
                  placeholder="Tìm kiếm template theo tên, mô tả..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | "all")}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryText(category)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as TemplateStatus | "all")}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>

                <select
                  value={isFreeFilter === "all" ? "all" : isFreeFilter ? "true" : "false"}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIsFreeFilter(value === "all" ? "all" : value === "true");
                  }}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="true">Miễn phí</option>
                  <option value="false">Trả phí</option>
                </select>

                <input
                  type="text"
                  placeholder="Tên người bán"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                />

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                  />
                  <input
                    type="number"
                    placeholder="Giá tối đa"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="py-4 lg:py-6">
          {isLoading ? (
            <div className="text-center py-16">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCode className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy template
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm, hoặc thêm template mới
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
              {/* Page Size and Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Hiển thị:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>mục/trang</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements.toLocaleString()} kết quả
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-xl hover:border-gray-300/50 transition-all duration-300 group transform hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={template.thumbnailFile?.path || "/placeholder-image.jpg"}
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
                            {template.demoUrl && (
                              <a
                                href={template.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 backdrop-blur rounded-full text-gray-700 hover:bg-white transition-colors shadow-lg"
                              >
                                <FiEye className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteTemplate(template)}
                              className="p-2 bg-white/90 backdrop-blur rounded-full text-red-600 hover:bg-white transition-colors shadow-lg"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              template.status
                            )} backdrop-blur-sm`}
                          >
                            {getStatusText(template.status)}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 flex-1">
                            {template.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(template)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FiStar className="w-4 h-4 text-amber-500" />
                            <span className="font-medium">
                              {template.rating.toFixed(1)}
                            </span>
                            <span className="text-xs">
                              ({template.totalReviews})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <FiDownload className="w-4 h-4" />
                            {template.totalDownloads.toLocaleString()}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                            {getCategoryText(template.category)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Người bán: {template.seller.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Bán: {template.totalSales}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
{/* Mobile List View */}
                  <div className="block lg:hidden">
                    {templates.map((template, index) => (
                      <div
                        key={template.id}
                        className={`p-4 ${
                          index !== templates.length - 1 ? "border-b border-gray-200/50" : ""
                        } hover:bg-gray-50/50 transition-colors`}
                      >
                        <div className="flex gap-4">
                          <img
                            src={template.thumbnailFile?.path || "/placeholder-image.jpg"}
                            alt={template.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                {template.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold border ml-2 ${getStatusColor(
                                  template.status
                                )}`}
                              >
                                {getStatusText(template.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-bold text-blue-600">
                                {formatPrice(template)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FiStar className="w-3 h-3 text-amber-500" />
                                <span>{template.rating.toFixed(1)}</span>
                                <span>({template.totalReviews})</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                              <span>{getCategoryText(template.category)}</span>
                              <span className="flex items-center gap-1">
                                <FiDownload className="w-3 h-3" />
                                {template.totalDownloads.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {template.seller.name}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditTemplate(template)}
                                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                  <FiEdit3 className="w-3.5 h-3.5" />
                                </button>
                                {template.demoUrl && (
                                  <a
                                    href={template.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                  >
                                    <FiEye className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteTemplate(template)}
                                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <FiTrash2 className="w-3.5 h-3.5" />
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
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Template
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Danh mục
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Giá
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Trạng thái
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Đánh giá
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Lượt tải
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                            Người bán
                          </th>
                          <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((template, index) => (
                          <tr
                            key={template.id}
                            className={`hover:bg-gray-50/50 transition-colors ${
                              index !== templates.length - 1 ? "border-b border-gray-200/30" : ""
                            }`}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={template.thumbnailFile?.path || "/placeholder-image.jpg"}
                                  alt={template.name}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                    {template.name}
                                  </h3>
                                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                                    {template.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {getCategoryText(template.category)}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm font-bold text-blue-600">
                                {formatPrice(template)}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  template.status
                                )}`}
                              >
                                {getStatusText(template.status)}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1 text-sm">
                                <FiStar className="w-4 h-4 text-amber-500" />
                                <span className="font-medium">
                                  {template.rating.toFixed(1)}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  ({template.totalReviews})
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FiDownload className="w-4 h-4" />
                                <span>{template.totalDownloads.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm text-gray-900">
                                {template.seller.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {template.totalSales} lượt bán
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditTemplate(template)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <FiEdit3 className="w-4 h-4" />
                                </button>
                                {template.demoUrl && (
                                  <a
                                    href={template.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteTemplate(template)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                  <div className="text-sm text-gray-600">
                    Trang {currentPage + 1} của {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* First Page */}
                    <button
                      onClick={() => handlePageChange(0)}
                      disabled={currentPage === 0}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronsLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))}
                    </div>
                    
                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                    
                    {/* Last Page */}
                    <button
                      onClick={() => handlePageChange(totalPages - 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Thêm Template Mới
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên template *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên template"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      value={formData.category || Category.PORTFOLIO}
                      onChange={(e) => handleFormChange("category", e.target.value as Category)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {getCategoryText(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả chi tiết về template"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại template
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isFree"
                          checked={formData.isFree === true}
                          onChange={() => handleFormChange("isFree", true)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Miễn phí</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isFree"
                          checked={formData.isFree === false}
                          onChange={() => handleFormChange("isFree", false)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Trả phí</span>
                      </label>
                    </div>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá (VNĐ) *
                      </label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => handleFormChange("price", Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập giá template"
                        min="0"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status || TemplateStatus.PENDING}
                    onChange={(e) => handleFormChange("status", e.target.value as TemplateStatus)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File template
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".zip,.rar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ chấp nhận file .zip hoặc .rar
                  </p>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    Thêm Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chỉnh Sửa Template
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên template *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên template"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      value={formData.category || Category.PORTFOLIO}
                      onChange={(e) => handleFormChange("category", e.target.value as Category)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {getCategoryText(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả chi tiết về template"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại template
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isFree"
                          checked={formData.isFree === true}
                          onChange={() => handleFormChange("isFree", true)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Miễn phí</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isFree"
                          checked={formData.isFree === false}
                          onChange={() => handleFormChange("isFree", false)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Trả phí</span>
                      </label>
                    </div>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá (VNĐ) *
                      </label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => handleFormChange("price", Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập giá template"
                        min="0"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status || TemplateStatus.PENDING}
                    onChange={(e) => handleFormChange("status", e.target.value as TemplateStatus)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cập nhật file template
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".zip,.rar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ chấp nhận file .zip hoặc .rar. Để trống nếu không muốn thay đổi.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    Cập Nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xóa Template
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa template "{selectedTemplate.name}"? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
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