package com.example.be.services.facade;

import com.example.be.dao.*;
import com.example.be.dto.admin.UpdateOrderStatusDto;
import com.example.be.dto.user.*;
import com.example.be.entities.Order;
import com.example.be.mappers.*;
import com.example.be.services.SecurityService;
import com.example.be.services.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserFacadeService {
    private final UserDao userDao;
    private final SellerDao sellerProfileDao;
    private final TemplateDao templateDao;
    private final OrderDao orderDao;
    private final OrderItemDao orderItemDao;
    private final CouponDao couponDao;
    private final CouponUsageDao couponUsageDao;
    private final PayoutDao payoutDao;
    private final SalesReportDao salesReportDao;
    private final TemplateDomainService templateDomainService;
    private final UserMapper userMapper;
    private final UserDomainService userDomainService;
    private final OrderDomainService orderDomainService;
    private final SellerDomainService sellerDomainService;
    private final TemplateMapper templateMapper;
    private final SellerProfileMapper sellerProfileMapper;
    private final OrderMapper orderMapper;
    private final CouponMapper couponMapper;
    private final CouponDomainService couponDomainService;
    private final CouponUsageMapper couponUsageMapper;
    private final WishlistDomainService wishlistDomainService;
    private final SecurityService securityService;
    private final CartDomainService cartDomainService;
    private final CartMapper cartMapper;
    private final ReviewsDomainService reviewsDomainService;
    private final ReviewsMapper reviewsMapper;
    private final CommentDomainService commentDomainService;
    private final CommentMapper commentMapper;
    private final WishlistMapper wishlistMapper;

    // Profile Management
    @PreAuthorize("#userId == authentication.principal.id")
    public UserProfileDto getUserProfile(Long userId) throws Exception {
        return userMapper.entityToDto(userDomainService.findById(userId));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public UserProfileDto updateProfile(Long userId, UserUpdateProfileDto dto) throws Exception {
        return userMapper.entityToDto(userDomainService.updateProfile(userId, dto));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public UserProfileDto updateAvatar(Long userId, MultipartFile file) throws Exception {
        return userMapper.entityToDto(userDomainService.updateUserAvatar(userId, file));
    }


    @PreAuthorize("#userId == authentication.principal.id")
    public void changePassword(Long userId, ChangePasswordDto dto) throws Exception {
        userDomainService.changePassword(userId, dto);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public Page<CartItemDto> getCartItems(Long userId, Pageable pageable) {
        return cartDomainService.getUserCart(userId, pageable).map(cartItem -> {
            CartItemDto cartItemDto = cartMapper.entityToDto(cartItem);
            TemplateCardDto template = cartItemDto.getTemplate();
            template.setIsInWishlist(wishlistDomainService.isInWishlist(userId, template.getId()));
            return cartItemDto;
        });
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public CartItemDto addToCart(Long userId, Long templateId) throws Exception {
        CartItemDto cartItemDto = cartMapper.entityToDto(cartDomainService.addToCart(userId, templateId));
        TemplateCardDto template = cartItemDto.getTemplate();
        template.setIsInWishlist(wishlistDomainService.isInWishlist(userId, template.getId()));
        return cartItemDto;
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void removeFromCart(Long userId, Long templateId) throws Exception {
        cartDomainService.removeFromCart(userId, templateId);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void clearCart(Long userId) throws Exception {
        cartDomainService.clearCart(userId);
    }

    // Order Management
    @PreAuthorize("#userId == authentication.principal.id")
    public OrderDto createOrder(Long userId, CreateOrderDto dto) throws Exception {
        Order order = orderDomainService.createOrder(userId, dto);
        return orderMapper.entityToDto(order);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public OrderDto updateOrderStatus(Long userId, Long orderId, UpdateOrderStatusDto dto, String orderIdPrefix) throws Exception {
        Order order = orderDomainService.updateOrderStatus(orderId, dto, orderIdPrefix);
        return orderMapper.entityToDto(order);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public OrderDto updateOrderStatus(Long userId, Long orderId, UpdateOrderStatusDto dto) throws Exception {
        Order order = orderDomainService.updateOrderStatus(orderId, dto);
        return orderMapper.entityToDto(order);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public Page<OrderDto> getOrderHistory(Long userId, Pageable pageable) {
        return orderDomainService.getUserOrders(userId, pageable).map(orderMapper::entityToDto);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public OrderDto getOrderDetail(Long userId, Long orderId) throws Exception {
        return orderMapper.entityToDto(orderDomainService.getOrderById(orderId));
    }

//    @PreAuthorize("#userId == authentication.principal.id")
//    public byte[] downloadTemplate(Long userId, Long orderItemId);

    // Review & Comment
    @PreAuthorize("#userId == authentication.principal.id")
    public ReviewDto createReview(Long userId, CreateReviewDto dto) throws Exception {
        return reviewsMapper.entityToDto(reviewsDomainService.createReview(userId, dto));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public ReviewDto updateReview(Long userId, Long reviewId, UpdateReviewDto dto) throws Exception {
        return reviewsMapper.entityToDto(reviewsDomainService.updateReview(reviewId, dto));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void deleteReview(Long userId, Long reviewId) throws Exception {
        reviewsDomainService.deleteReview(reviewId);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public CommentDto createComment(Long userId, CreateCommentDto dto) throws Exception {
        return commentMapper.entityToDto(commentDomainService.createComment(userId, dto));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public CommentDto updateComment(Long userId, Long commentId, String content) throws Exception {
        return commentMapper.entityToDto(commentDomainService.updateComment(commentId, content));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void deleteComment(Long userId, Long commentId) throws Exception {
        commentDomainService.deleteComment(commentId);
    }

    // Wishlist
    @PreAuthorize("#userId == authentication.principal.id")
    public Page<WishlistDto> getWishlist(Long userId, Pageable pageable) {
        return wishlistDomainService.getUserWishlist(userId, pageable).map(wishlistMapper::entityToDto);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public WishlistDto addToWishlist(Long userId, Long templateId) throws Exception {
        return wishlistMapper.entityToDto(wishlistDomainService.addToWishlist(userId, templateId));
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void removeFromWishlist(Long userId, Long wishListId) throws Exception {
        wishlistDomainService.removeFromWishlist(wishListId);
    }

    // Coupon
    @PreAuthorize("#userId == authentication.principal.id")
    public Double validateCoupon(Long userId, String couponCode, Double orderAmount) throws Exception {
        return couponDomainService.applyCoupon(couponCode, orderAmount, userId);
    }
}