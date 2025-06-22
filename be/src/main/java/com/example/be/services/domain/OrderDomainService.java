package com.example.be.services.domain;

import com.example.be.dao.CartDao;
import com.example.be.dao.OrderDao;
import com.example.be.dao.OrderItemDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dto.admin.UpdateOrderStatusDto;
import com.example.be.dto.user.CreateOrderDto;
import com.example.be.entities.CartItem;
import com.example.be.entities.Order;
import com.example.be.entities.OrderItem;
import com.example.be.entities.Template;
import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PaymentStatus;
import com.example.be.services.VNPAYService;
import com.example.be.specifications.OrderSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderDomainService {
    private final TemplateDao templateDao;
    private final OrderDao orderDao;
    private final OrderItemDao orderItemDao;
    private final CouponDomainService couponDomainService;
    private final CartDao cartDao;
    private final VNPAYService vnPayService;

    public Page<Order> searchOrders(OrderStatus status, PaymentStatus paymentStatus, PaymentMethod paymentMethod, LocalDateTime createdFrom, LocalDateTime createdTo, BigDecimal min, BigDecimal max, Pageable pageable) {

        Specification<Order> spec = OrderSpecification.build(
                status != null ? OrderSpecification.hasStatus(status) : null,
                paymentStatus != null ? OrderSpecification.hasPaymentStatus(paymentStatus) : null,
                paymentMethod != null ? OrderSpecification.hasPaymentMethod(paymentMethod) : null,
                createdFrom != null ? OrderSpecification.createdAfter(createdFrom) : null,
                createdTo != null ? OrderSpecification.createdBefore(createdTo) : null,
                (min != null && max != null)
                        ? OrderSpecification.totalAmountBetween(min, max)
                        : null
        );
        return orderDao.findAll(spec, pageable);
    }

    public Order createOrder(Long userId, CreateOrderDto dto) throws Exception {
        List<CartItem> cartItems = Streamable.of(cartDao.findAllById(dto.getCartItemIds())).stream().toList();

        // Calculate total amount
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getTemplate().getDiscountPrice() != null ? item.getTemplate().getDiscountPrice() : item.getTemplate().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply coupon if provided
        Double discountAmount = 0.0;
        if (dto.getCouponCode() != null && !dto.getCouponCode().isEmpty()) {
            discountAmount = couponDomainService.applyCoupon(dto.getCouponCode(), totalAmount.doubleValue(), userId);
        }

        // Calculate tax
        double taxAmount = totalAmount.doubleValue() * 0.1; // 10% tax

        Order order = Order.builder()
                .user(cartItems.get(0).getUser())
                .taxAmount(BigDecimal.valueOf(taxAmount))
                .currency("VND")
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .paymentMethod(dto.getPaymentMethod())
                .billingInfo(dto.getBillingInfo())
                .notes(dto.getNotes())
                .build();


        // Create order items
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .template(cartItem.getTemplate())
                        .price(cartItem.getTemplate().getPrice())
                        .licenseType(cartItem.getTemplate().getLicenseType())
                        .commissionRate(cartItem.getTemplate().getSeller().getCommissionRate())
                        .build())
                .toList();

        order.setOrderItems(orderItems);

        Order savedOrder = orderDao.save(order);

//        // Process payment
//        if (order.getPaymentMethod() == PaymentMethod.VNPAY) {
//            String transactionId = vnPayService.createPaymentUrl(order.getId().toString(),
//                    BigDecimal.valueOf(totalAmount.doubleValue() - discountAmount + taxAmount),
//                    "127.0.0.1"
//            );
//            order.setPaymentTransactionId(transactionId);
//            order.setPaymentStatus(PaymentStatus.PAID);
//            order.setStatus(OrderStatus.COMPLETED);
//            order.setBillingInfo(dto.getBillingInfo());
//            order.setCompletedAt(LocalDateTime.now());
//        }
//
        // Clear cart
        cartDao.deleteAllById(dto.getCartItemIds());

        // Update template sales count
        cartItems.forEach(cartItem -> {
            Template template = cartItem.getTemplate();
            template.setTotalSales(template.getTotalSales() + 1);
            templateDao.save(template);
        });

        // Use coupon if applied
        if (dto.getCouponCode() != null && !dto.getCouponCode().isEmpty()) {
            couponDomainService.useCoupon(dto.getCouponCode(), userId, savedOrder.getId(), discountAmount);
        }

        return savedOrder;
    }

    public Order updateOrderStatus(Long orderId, UpdateOrderStatusDto dto) throws Exception {
        Order order = getOrderById(orderId);

        order.setStatus(dto.getStatus());
        order.setPaymentStatus(dto.getPaymentStatus());
        if (dto.getNotes() != null) {
            order.setNotes(dto.getNotes());
        }

        if (dto.getStatus() == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }

        return orderDao.save(order);
    }

    public Order getOrderById(Long orderId) throws Exception {
        return orderDao.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));
    }

    public Page<Order> getUserOrders(Long userId, Pageable pageable) {
        return orderDao.findByUser_Id(userId, pageable);
    }

    public boolean hasUserPurchasedTemplate(Long userId, Long templateId) {
        return orderItemDao.existsByOrder_User_IdAndTemplate_IdAndOrder_Status(
                userId, templateId, OrderStatus.COMPLETED);
    }
}
