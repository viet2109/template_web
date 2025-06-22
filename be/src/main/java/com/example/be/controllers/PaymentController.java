package com.example.be.controllers;

import com.example.be.dto.admin.UpdateOrderStatusDto;
import com.example.be.dto.user.PaymentRequestDto;
import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentStatus;
import com.example.be.services.SecurityService;
import com.example.be.services.VNPAYService;
import com.example.be.services.facade.UserFacadeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment/vnpay")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPAYService vnPayService;
    private final SecurityService securityService;
    private final UserFacadeService userFacadeService;
    //    private static final String ORDER_ID_PREFIX = "VNPAY-ODR-";
    private static final String ORDER_ID_PREFIX = "VNPAY-ODR-TESTING-";

    @PostMapping
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaymentRequestDto dto,
                                                             HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getLocalAddr();
            }
        } catch (Exception e) {
            ipAddress = "127.0.0.1";
        }

        String paymentUrl = vnPayService.createPaymentUrl(ORDER_ID_PREFIX + dto.getOrderId(), dto.getAmount(), ipAddress);
        return ResponseEntity.ok(Collections.singletonMap("paymentUrl", paymentUrl));
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> returnPayment(
            @RequestParam Map<String, String> params, @RequestBody Long orderId) throws Exception {

        boolean valid = vnPayService.validateSignature(params);
        Map<String, Object> body = new HashMap<>();
        Long userId = securityService.getUserFromRequest().getId();

        if (!valid) {
            body.put("status", "error");
            body.put("message", "Chữ ký không hợp lệ");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(body);
        }

        String responseCode = params.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            body.put("status", "success");
            body.put("message", "Thanh toán thành công");
            body.put("transactionRef", params.get("vnp_TxnRef"));
            body.put("amount", params.get("vnp_Amount"));
            userFacadeService.updateOrderStatus(userId, orderId, UpdateOrderStatusDto.builder().paymentStatus(PaymentStatus.PAID).status(OrderStatus.COMPLETED).build());
        } else {
            body.put("status", "failed");
            body.put("message", "Thanh toán không thành công");
            body.put("responseCode", responseCode);
            userFacadeService.updateOrderStatus(userId, orderId, UpdateOrderStatusDto.builder().paymentStatus(PaymentStatus.FAILED).status(OrderStatus.CANCELLED).build());
        }
        return ResponseEntity.ok(body);
    }
}
